import React, {useEffect, useState} from "react";
import {createWorker, Worker} from "tesseract.js";
import cv from '@techstark/opencv-js';
import './App.css';
import trashIcon from './assets/trashIcon.png';
import ImageUtils from "@/utils/imageUtils.ts";
import OcrUtils from "@/utils/ocrUtils.ts";
import {RelicMainStats, RelicSubStats} from "@/types.ts";

function App() {
    const [worker, setWorker] = useState<Worker | null>(null);

    const titlePartRef = React.useRef<HTMLCanvasElement>(null);
    const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
    const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

    const [relicTitle, setRelicTitle] = useState('');
    const [mainRelicStats, setMainRelicStats] = useState<RelicMainStats[]>([]);
    const [subRelicStats, setSubRelicStats] = useState<RelicSubStats[]>([]);


    const [mainRelicStatsError, setMainRelicStatsError] = useState<string | null>(null);
    const [subRelicStatsError, setSubRelicStatsError] = useState<string | null>(null);

    const [absoluteScore, setAbsoluteScore] = useState('');


    // setInterval(async () => {
    //     await captureScreen();
    // }, 1000);

    useEffect(() => {
        // Initialize the worker
        const initializeWorker = async () => {
            const newWorker = await createWorker('eng');
            await newWorker.load();
            setWorker(newWorker);
        };

        initializeWorker();

        return () => {
            // Terminate the worker when component unmounts
            worker?.terminate();
        };
    }, []);

    useEffect(() => {
        let maxAbsoluteScore = 0;
        let minAbsoluteScore = 0;
        if (mainRelicStatsError || subRelicStatsError || mainRelicStats.length == 0 || subRelicStats.length == 0) {
            return;
        }

        // The relic can have 3-4 sub stats at level 0, each 3 levels will increase the score by 1
        const maxScore = mainRelicStats[0].level == 0 ? 4 : Math.floor(mainRelicStats[0].level / 3) + 4

        // Calculate the current relic score
        for (let i = 0; i < subRelicStats.length; i++) {
            const subStat = subRelicStats[i];
            // the spd can have multiple scores
            if (subStat.score instanceof Array) {
                const maxScore = Math.max(...subStat.score);
                const minScore = Math.min(...subStat.score);
                maxAbsoluteScore += maxScore;
                minAbsoluteScore += minScore;
            } else {
                maxAbsoluteScore += Number(subStat.score);
                minAbsoluteScore += Number(subStat.score);
            }
        }

        maxAbsoluteScore = parseFloat(maxAbsoluteScore.toFixed(2));
        minAbsoluteScore = parseFloat(minAbsoluteScore.toFixed(2));

        if (minAbsoluteScore == maxAbsoluteScore) {
            setAbsoluteScore(`${maxAbsoluteScore} / ${maxScore}`);
        } else {
            setAbsoluteScore(`${minAbsoluteScore} - ${maxAbsoluteScore} / ${maxScore}`);
        }
    }, [mainRelicStats, subRelicStats, mainRelicStatsError, subRelicStatsError]);


    const resetAttributes = () => {
        setAbsoluteScore('');
        setRelicTitle('');
        setMainRelicStats([]);
        setSubRelicStats([]);
        setMainRelicStatsError(null);
        setSubRelicStatsError(null);
    }


    const captureScreen = async () => {

        // reset the stats
        resetAttributes();

        const worker = await createWorker('eng');
        const res = await window.ipcRenderer.captureScreen();
        const croppedImage = res.crop({x: 1400, y: 0, width: 445, height: 800});

        try {
            // trash icon
            const trashIconGray = await ImageUtils.img2MatGray(trashIcon);

            // source image
            const imgGray = await ImageUtils.img2MatGray(croppedImage.toDataURL());
            const imgRGB = await ImageUtils.img2MatRGB(croppedImage.toDataURL());

            // match the trash icon
            const trashIconRes = new cv.Mat();
            cv.matchTemplate(imgGray, trashIconGray, trashIconRes, cv.TM_CCOEFF_NORMED);
            const minMaxLocTrashIcon = cv.minMaxLoc(trashIconRes);

            // anything above the trash icon should contain the relic title
            const relicTitleRGB = ImageUtils.matCrop(imgRGB, 0, 100, 445, 70);

            // anything below the trash icon should contain the relic stats
            const relicMainStatsRGB = ImageUtils.matCrop(imgRGB, 0, minMaxLocTrashIcon.maxLoc.y + trashIconGray.rows + 50, 445, 50);

            // anything below the relic stats should contain the relic sub stats
            const relicSubStatsRGB = ImageUtils.matCrop(imgRGB, 0, minMaxLocTrashIcon.maxLoc.y + trashIconGray.rows + 100, 445, imgGray.rows - 100 - minMaxLocTrashIcon.maxLoc.y - trashIconGray.rows);


            // convert each part to HSV
            const relicTitleHSV = new cv.Mat();
            cv.cvtColor(relicTitleRGB, relicTitleHSV, cv.COLOR_RGB2HSV);

            const relicMainStatsHSV = new cv.Mat();
            cv.cvtColor(relicMainStatsRGB, relicMainStatsHSV, cv.COLOR_RGB2HSV);

            const relicSubStatsHSV = new cv.Mat();
            cv.cvtColor(relicSubStatsRGB, relicSubStatsHSV, cv.COLOR_RGB2HSV);

            // apply mask to each part
            const maskedRelicTitle = ImageUtils.applyFilter(relicTitleHSV, relicTitleRGB);
            const maskedRelicMainStats = ImageUtils.applyFilter(relicMainStatsHSV, relicMainStatsRGB);
            const maskedRelicSubStats = ImageUtils.applyFilter(relicSubStatsHSV, relicSubStatsRGB);

            // Show image
            cv.imshow(titlePartRef.current, maskedRelicTitle);
            cv.imshow(mainStatsPartRef.current, maskedRelicMainStats);
            cv.imshow(subStatsPartRef.current, maskedRelicSubStats);


            const relicTitleOCRResult = await OcrUtils.relicTitleExtractor(worker, titlePartRef.current.toDataURL());
            const relicMainStatsOCRResult = await OcrUtils.relicMainStatsExtractor(worker, mainStatsPartRef.current.toDataURL());
            const relicSubStatsOCRResult = await OcrUtils.relicSubStatsExtractor(worker, subStatsPartRef.current.toDataURL());


            setRelicTitle(relicTitleOCRResult);
            if (relicMainStatsOCRResult.error) {
                setMainRelicStatsError(relicMainStatsOCRResult.error);
            }
            setMainRelicStats(relicMainStatsOCRResult.result);

            if (relicSubStatsOCRResult.error) {
                setSubRelicStatsError(relicSubStatsOCRResult.error);
            }

            setSubRelicStats(relicSubStatsOCRResult.result);


            console.log(relicTitleOCRResult);
            console.log(relicMainStatsOCRResult);
            console.log(relicSubStatsOCRResult);

            // release the memory
            imgGray.delete();
            imgRGB.delete();
            relicTitleRGB.delete();
            relicMainStatsRGB.delete();
            relicSubStatsRGB.delete();
            relicTitleHSV.delete();
            relicMainStatsHSV.delete();
            relicSubStatsHSV.delete();
            maskedRelicTitle.delete();
            maskedRelicMainStats.delete();
            maskedRelicSubStats.delete();
            trashIconRes.delete();
            trashIconGray.delete();
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div>
            <div className={"error"}>Make sure the relics in Unlock state, or the result will contain error</div>
            <div className={"mainContainer"}>
                <div className={"leftContainer"}>
                    <h3>HSR-Scanner</h3>
                    <button onClick={captureScreen} style={{alignSelf: 'center'}}>
                        Scan
                    </button>
                    <div className={"title"}>{relicTitle}</div>
                    <div>
                        <span className="absoluteScoreTitle">
                            Absolute score:
                        </span>
                        <span className="absoluteScore">
                            {absoluteScore}
                        </span>
                    </div>
                    <div className={"title"}>Main Stats:</div>
                    {
                        mainRelicStatsError || mainRelicStats.length == 0 ?
                            <div className={"error"}>{mainRelicStatsError}</div> :
                            <div className={"statsContainer"}>
                                {
                                    mainRelicStats.map((stat, index) => (
                                        <div key={index}>
                                            <span className={"statsName"}>{stat.name}</span>
                                            :<span className={"statsNumber"}>{stat.number}</span>
                                            <span className={"statsLevel"}>Level:</span>
                                            <span className={"statsLevelNumber"}>{
                                                stat.level
                                            }</span>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                    <div className={"title"}>Sub Stats:</div>
                    {
                        subRelicStatsError || subRelicStats.length == 0 ?
                            <div className={"error"}>{subRelicStatsError}</div> :
                            <div className={"statsContainer"}>
                                {
                                    subRelicStats.map((stat, index) => (
                                        <div key={index}>
                                            <span className={"statsName"}>{stat.name}</span>
                                            :<span className={"statsNumber"}>{stat.number}</span>
                                            <span className={"statsScore"}>score:</span>
                                            <span className={"statsNumber"}>{
                                                stat.score instanceof Array ? stat.score.join(' | ') : stat.score
                                            }</span>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                </div>
                <div className={"rightContainer"}>
                    <h3>Image Captured</h3>
                    <canvas ref={titlePartRef}/>
                    <canvas ref={mainStatsPartRef}/>
                    <canvas ref={subStatsPartRef}/>
                </div>
            </div>
        </div>

    );
}

export default App;
