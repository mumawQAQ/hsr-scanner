import React, {useEffect, useState} from "react";
import {createWorker, Worker} from "tesseract.js";
import cv from '@techstark/opencv-js';
import './App.css';
import ImageUtils from "@/utils/imageUtils.ts";
import OcrUtils from "@/utils/ocrUtils.ts";
import {RelicMainStats, RelicSubStats} from "../types.ts";
import relicUtils from "@/utils/relicUtils.ts";
import ValuableSubList from "@/components/ValuableSubList.tsx";
import {Button, Chip, Input} from "@nextui-org/react";
import clsx from "clsx";
import {Add, Remove} from "@mui/icons-material";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function App() {
    const [worker, setWorker] = useState<Worker | null>(null);

    const titlePartRef = React.useRef<HTMLCanvasElement>(null);
    const mainStatsPartRef = React.useRef<HTMLCanvasElement>(null);
    const subStatsPartRef = React.useRef<HTMLCanvasElement>(null);

    const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null);
    const [workerInitialized, setWorkerInitialized] = useState(false);
    const [scanningStatus, setScanningStatus] = useState(false);
    const [scanningInterval, setScanningInterval] = useState<number>(2000);
    const [imageCapturedShowed, setImageCapturedShowed] = useState(true);


    const [relicTitle, setRelicTitle] = useState('');
    const [mainRelicStats, setMainRelicStats] = useState<RelicMainStats[]>([]);
    const [subRelicStats, setSubRelicStats] = useState<RelicSubStats[]>([]);

    const [valuableSubStats, setValuableSubStats] = useState<string[]>([]);

    const [_, setShouldLockStats] = useState<string[][]>([]);


    const [mainRelicStatsError, setMainRelicStatsError] = useState<string | null>(null);
    const [subRelicStatsError, setSubRelicStatsError] = useState<string | null>(null);

    const [absoluteScore, setAbsoluteScore] = useState('');
    const [isMostValuableRelic, setIsMostValuableRelic] = useState(false);
    const [isValuableRelic, setIsValuableRelic] = useState(false);
    const [isValuableMainStats, setIsValuableMainStats] = useState(false);
    const [isValuableSubStats, setIsValuableSubStats] = useState<{ [index: number]: boolean }>({
        1: false,
        2: false,
        3: false,
        4: false
    });

    useEffect(() => {
        // Initialize the worker
        const initializeWorker = async () => {
            const newWorker = await createWorker('eng');
            await newWorker.load();
            setWorker(newWorker);
            setWorkerInitialized(true);
        };

        initializeWorker();

        return () => {
            // Terminate the worker when component unmounts
            worker?.terminate();
        };
    }, []);

    useEffect(() => {
        // make sure the worker is initialized
        if (!workerInitialized) {
            return;
        }

        // if the scanning is started, then start the interval
        if (!scanningStatus) {
            return;
        }

        const interval = setInterval(async () => {
            await captureScreen();
        }, scanningInterval);

        return () => clearInterval(interval);
    }, [currentImage, workerInitialized, scanningInterval, scanningStatus]);

    useEffect(() => {
        setIsMostValuableRelic(false)
        setIsValuableRelic(false);
        setIsValuableMainStats(false);
        setIsValuableSubStats({
            1: false,
            2: false,
            3: false,
            4: false
        })
        setValuableSubStats([]);
        setShouldLockStats([]);
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

        // add relative score for each sub stat based on the relic type
        // get the current relic rating
        relicUtils.getRelicRatingInfo(relicTitle, mainRelicStats[0].name).then((relicRatingInfo: any) => {
            // if the relicRatingInfo is not found
            if (!relicRatingInfo) {
                return;
            }

            // the relicRatingInfo is found
            setIsValuableMainStats(true);

            const configValuableSubStats = relicRatingInfo.valuableSub;
            const configShouldLockStats = relicRatingInfo.shouldLock;

            setValuableSubStats(configValuableSubStats);
            setShouldLockStats(configShouldLockStats);


            // extract the name from the subRelicStats
            const subStatsList = subRelicStats.map(stat => stat.name);

            // check if the relic is the most valuable relic
            if (relicUtils.isMostValuableRelic(configShouldLockStats, subStatsList)) {
                setIsMostValuableRelic(true)
            }

            // label the valuable sub stats
            const labeledSubStats = relicUtils.labelValuableSubStats(configValuableSubStats, subStatsList)

            setIsValuableSubStats(labeledSubStats)

            // if the valuable sub stats is more than 1, then the relic is valuable
            if (Object.values(labeledSubStats).filter(val => val).length >= 1) {
                setIsValuableRelic(true);
            } else {
                setIsValuableRelic(false);
            }
        });

    }, [mainRelicStats, subRelicStats, mainRelicStatsError, subRelicStatsError, relicTitle]);


    const resetAttributes = () => {
        setAbsoluteScore('');
        setRelicTitle('');
        setMainRelicStats([]);
        setSubRelicStats([]);
        setMainRelicStatsError(null);
        setSubRelicStatsError(null);
    }


    const captureScreen = async () => {
        const res = await (window as any).ipcRenderer.captureScreen();
        const croppedImage = res.crop({x: 1400, y: 0, width: 445, height: 800});

        // if the image is not changed, do not process it
        if (currentImage && currentImage == croppedImage.toDataURL()) {
            console.log('Image not changed');
            return;
        }

        // reset the stats
        resetAttributes();
        setCurrentImage(croppedImage.toDataURL());

        try {
            // source image
            const imgGray = await ImageUtils.img2MatGray(croppedImage.toDataURL());
            const imgRGB = await ImageUtils.img2MatRGB(croppedImage.toDataURL());

            // anything above the trash icon should contain the relic title
            const relicTitleRGB = ImageUtils.matCrop(imgRGB, 0, 100, 445, 70);

            // anything below the trash icon should contain the relic stats
            const relicMainStatsRGB = ImageUtils.matCrop(imgRGB, 0, 392, 445, 50);

            // anything below the relic stats should contain the relic sub stats
            const relicSubStatsRGB = ImageUtils.matCrop(imgRGB, 0, 442, 445, 358);


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


            // make sure the work in initialized
            if (worker) {
                if (titlePartRef.current) {
                    cv.imshow(titlePartRef.current, maskedRelicTitle);
                    const relicTitleOCRResult = await OcrUtils.relicTitleExtractor(worker, titlePartRef.current.toDataURL());
                    setRelicTitle(relicTitleOCRResult);
                }


                if (mainStatsPartRef.current) {
                    cv.imshow(mainStatsPartRef.current, maskedRelicMainStats);
                    const relicMainStatsOCRResult = await OcrUtils.relicMainStatsExtractor(worker, mainStatsPartRef.current.toDataURL());

                    if (relicMainStatsOCRResult.error) {
                        setMainRelicStatsError(relicMainStatsOCRResult.error);
                    }
                    setMainRelicStats(relicMainStatsOCRResult.result);
                }

                if (subStatsPartRef.current) {
                    cv.imshow(subStatsPartRef.current, maskedRelicSubStats);
                    const relicSubStatsOCRResult = await OcrUtils.relicSubStatsExtractor(worker, subStatsPartRef.current.toDataURL());
                    if (relicSubStatsOCRResult.error) {
                        setSubRelicStatsError(relicSubStatsOCRResult.error);
                    }
                    setSubRelicStats(relicSubStatsOCRResult.result);
                }

            }


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
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddValuableMainStats = async () => {
        const result = await relicUtils.addRelicRatingValuableMain(relicTitle, mainRelicStats[0].name);
        if (result.success) {
            setIsValuableMainStats(true);
            toast(result.message, {type: "success"})
        } else {
            toast(result.message, {type: "error"})
        }
    }

    const handleRemoveValuableMainStats = async () => {
        const result = await relicUtils.removeRelicRatingValuableMain(relicTitle, mainRelicStats[0].name);
        if (result.success) {
            setIsValuableMainStats(false);
            toast(result.message, {type: "success"})
        } else {
            toast(result.message, {type: "error"})
        }
    }

    const handleToggleImageCaptured = () => {
        setImageCapturedShowed(!imageCapturedShowed);
    }

    return (
        <div>
            <ToastContainer/>
            <div className={"flex flex-row justify-around gap-2 min-h-full min-w-full"}>
                <div className={
                    clsx(imageCapturedShowed ? "w-1/2" : "w-full")
                }>
                    <div className={"flex flex-col justify-center gap-2"}>
                        <div className={"flex justify-center gap-2"}>
                            <Button onPress={() => {
                                setScanningStatus(!scanningStatus);
                            }}>
                                {scanningStatus ? '停止' : '开始'}扫描
                            </Button>
                            <Button onPress={handleToggleImageCaptured}>
                                {imageCapturedShowed ? '隐藏' : '显示'}图像
                            </Button>
                        </div>
                        <div>
                            <Input
                                label={"扫描频率(ms):"}
                                type="number"
                                value={scanningInterval.toString()}
                                onChange={(e) => {
                                    setScanningStatus(false)
                                    setScanningInterval(Number(e.target.value));
                                }}
                            />
                        </div>
                    </div>

                    <div className={"flex flex-row justify-center gap-2 p-2"}>
                        <div className={"font-bold"}>{relicTitle}</div>
                        {
                            <Chip color={
                                isMostValuableRelic ? "success" :
                                    isValuableRelic ? "warning" : "danger"
                            }>
                                {
                                    isMostValuableRelic ? "建议锁定" :
                                        isValuableRelic ? "可以保留" : "建议分解"
                                }
                            </Chip>
                        }
                    </div>
                    <div className={"flex gap-1 justify-center"}>
                        <span className="font-bold">
                            遗器成长值:
                        </span>
                        <span className={"text-blue-500"}>
                            {absoluteScore}
                        </span>
                    </div>
                    <div className={"font-bold"}>主属性:</div>
                    {
                        mainRelicStatsError || mainRelicStats.length == 0 ?
                            <div className={"text-red-700 my-2"}>{mainRelicStatsError}</div> :
                            <div className={"border-2 shadow"}>
                                {
                                    mainRelicStats.map((stat, index) => (
                                        <div key={index} className={
                                            clsx({
                                                    isValuable: isValuableMainStats,
                                                    isNotValuable: !isValuableMainStats
                                                }, "flex justify-center gap-1"
                                            )
                                        }>
                                            <span className={"font-bold"}>{stat.name}</span>
                                            :<span className={"text-blue-500"}>{stat.number}</span>
                                            <span className={"font-bold"}>等级:</span>
                                            <span className={"text-blue-500"}>{
                                                stat.level
                                            }</span>
                                        </div>
                                    ))
                                }
                                {
                                    isValuableMainStats ?
                                        <div className={"my-2"}>
                                            <Button
                                                startContent={<Remove/>}
                                                variant={"flat"}
                                                color={"danger"}
                                                onPress={handleRemoveValuableMainStats}
                                            >
                                                移除有效主属性
                                            </Button>
                                        </div> :
                                        <div className={"my-2"}>
                                            <Button
                                                startContent={<Add/>}
                                                variant={"flat"}
                                                color={"success"}
                                                onPress={handleAddValuableMainStats}
                                            >
                                                添加为有效主属性
                                            </Button>
                                        </div>
                                }
                            </div>
                    }
                    <div className={"font-bold"}>副属性:</div>
                    {
                        subRelicStatsError || subRelicStats.length == 0 ?
                            <div className={"text-red-700 my-2"}>{subRelicStatsError}</div> :
                            <div className={"border-2 shadow"}>
                                {
                                    subRelicStats.map((stat, index) => (
                                        <div key={index} className={
                                            clsx({
                                                    isValuable: isValuableSubStats[index + 1],
                                                    isNotValuable: !isValuableSubStats[index + 1]
                                                }, "flex justify-center gap-2"
                                            )
                                        }>
                                            <div className={"flex gap-1"}>
                                                <span className={"font-bold"}>{stat.name}</span>
                                                :<span className={"text-blue-500"}>{stat.number}</span>
                                            </div>
                                            <div className={"flex gap-1"}>
                                                <span className={"font-bold"}>评分:</span>
                                                <span className={"text-blue-500"}>{
                                                    stat.score instanceof Array ? stat.score.join(' | ') : stat.score
                                                }</span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                    {
                        relicTitle && mainRelicStats && mainRelicStats.length > 0 &&
                        <ValuableSubList valuableSubStats={valuableSubStats} relicTitle={relicTitle}
                                         mainRelicStats={mainRelicStats[0].name}/>
                    }
                </div>
                <div className={clsx(
                    {
                        hidden: !imageCapturedShowed
                    },
                    "w-1/2 flex flex-col gap-2 justify-center items-center"
                )}>
                    <div>
                        图像捕获
                    </div>
                    <canvas ref={titlePartRef}/>
                    <canvas ref={mainStatsPartRef}/>
                    <canvas ref={subStatsPartRef}/>
                </div>
            </div>
        </div>

    );
}

export default App;
