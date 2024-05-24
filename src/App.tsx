import React, {useEffect, useState} from "react";
import {createWorker, Worker} from "tesseract.js";
import cv from '@techstark/opencv-js';
import './App.css';
import trashIcon from './assets/trashIcon.png';
import ImageUtils from "@/utils/imageUtils.ts";
import OcrUtils from "@/utils/ocrUtils.ts";
import {relicStats} from "@/types.ts";

function App() {
    const [worker, setWorker] = useState<Worker | null>(null);
    const titlePartRef = React.useRef<HTMLCanvasElement>(null);
    const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
    const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

    const [relicTitle, setRelicTitle] = useState('');
    const [mainRelicStats, setMainRelicStats] = useState<relicStats[]>([]);
    const [subRelicStats, setSubRelicStats] = useState<relicStats[]>([]);


    const [mainRelicStatsError, setMainRelicStatsError] = useState<string | null>(null);
    const [subRelicStatsError, setSubRelicStatsError] = useState<string | null>(null);


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

    const captureScreen = async () => {

        // reset the stats
        setRelicTitle('');
        setMainRelicStats([]);
        setSubRelicStats([]);
        setMainRelicStatsError(null);
        setSubRelicStatsError(null);

        const worker = await createWorker('eng');
        const res = await window.ipcRenderer.captureScreen();
        const croppedImage = res.crop({x: 10, y: 0, width: 500, height: 800});

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
            const relicTitleRGB = ImageUtils.matCrop(imgRGB, 0, 100, 500, 90);

            // anything below the trash icon should contain the relic stats
            const relicMainStatsRGB = ImageUtils.matCrop(imgRGB, 0, minMaxLocTrashIcon.maxLoc.y + trashIconGray.rows + 50, 500, 50);

            // anything below the relic stats should contain the relic sub stats
            const relicSubStatsRGB = ImageUtils.matCrop(imgRGB, 0, minMaxLocTrashIcon.maxLoc.y + trashIconGray.rows + 100, 500, imgGray.rows - 100 - minMaxLocTrashIcon.maxLoc.y - trashIconGray.rows);


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
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className={"mainContainer"}>
            <div className={"leftContainer"}>
                <h3>HSR-Scanner</h3>
                <button onClick={captureScreen} style={{alignSelf: 'center'}}>
                    Capture HSR-Scanner
                </button>
                <h4>{relicTitle}</h4>
                <h4>Main Stats:</h4>
                {
                    mainRelicStatsError ? <div className={"error"}>{mainRelicStatsError}</div> :
                        <div className={"statsContainer"}>
                            {
                                mainRelicStats.map((stat, index) => (
                                    <div key={index}>
                                        <span className={"statsName"}>{stat.name}</span>
                                        :<span className={"statsNumber"}>{stat.number}</span>
                                    </div>
                                ))
                            }
                        </div>
                }
                <h4>Sub Stats:</h4>
                {
                    subRelicStatsError ? <div className={"error"}>{subRelicStatsError}</div> :
                        <div className={"statsContainer"}>
                            {
                                subRelicStats.map((stat, index) => (
                                    <div key={index}>
                                        <span className={"statsName"}>{stat.name}</span>
                                        :<span className={"statsNumber"}>{stat.number}</span>
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

    );
}

export default App;
