import cv from '@techstark/opencv-js';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createWorker, Worker } from 'tesseract.js';

import { OCRResult, RelicMainStats, RelicRatingInfo, RelicSubStats } from '../../../type/types.ts';

import { Badge } from '@/components/ui/badge.tsx';
import useRelicStore from '@/hooks/use-relic-store.ts';
import { cn } from '@/lib/utils.ts';
import ImageUtils from '@/utils/imageUtils.ts';
import OcrUtils from '@/utils/ocrUtils.ts';
import relicUtils from '@/utils/relicRatingUtils.ts';

type ScanContentProps = {
  scanningStatus: boolean;
  scanInterval: number;
  titlePartRef: React.RefObject<HTMLCanvasElement>;
  mainStatsPartRef: React.RefObject<HTMLCanvasElement>;
  subStatsPartRef: React.RefObject<HTMLCanvasElement>;
};

const ScanContent = ({
  scanningStatus,
  scanInterval,
  titlePartRef,
  mainStatsPartRef,
  subStatsPartRef,
}: ScanContentProps) => {
  const {
    setRelicTitle,
    setMainRelicStats,
    setSubRelicStats,

    relicRatingInfo,
    fetchRelicRatingInfo,
    setRelicRatingInfo,
  } = useRelicStore(state => ({
    setRelicTitle: state.setRelicTitle,
    setMainRelicStats: state.setMainRelicStats,
    setSubRelicStats: state.setSubRelicStats,

    relicRatingInfo: state.relicRatingInfo,
    fetchRelicRatingInfo: state.fetchRelicRatingInfo,
    setRelicRatingInfo: state.setRelicRatingInfo,
  }));

  const [worker, setWorker] = useState<Worker | null>(null);
  const [workerInitialized, setWorkerInitialized] = useState(false);
  const currentImageRef = useRef<string | null>(null);

  const [isValuableRelic, setIsValuableRelic] = useState(false);
  const [isValuableMainStats, setIsValuableMainStats] = useState(false);
  const [isMostValuableRelic, setIsMostValuableRelic] = useState(false);
  const [isValuableSubStats, setIsValuableSubStats] = useState<{
    [index: number]: boolean;
  }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });
  const [relicGrowthRate, setRelicGrowthRate] = useState<{
    minGrowthScore: number;
    maxGrowthScore: number;
    maxScore: number;
  } | null>(null);
  const [OCRResult, setOCRResult] = useState<OCRResult | null>(null);

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
    }, scanInterval);

    return () => clearInterval(interval);
  }, [scanInterval, scanningStatus, workerInitialized]);

  useEffect(() => {
    if (!OCRResult || !relicRatingInfo) {
      return;
    }

    // check the errors
    if (OCRResult.title.error) {
      console.error(OCRResult.title.error); // TODO: log this to the log area
    }

    if (OCRResult.mainStats.error) {
      console.error(OCRResult.mainStats.error); // TODO: log this to the log area
    }

    if (OCRResult.subStats.error) {
      console.error(OCRResult.subStats.error); // TODO: log this to the log area
    }

    // check any missing data
    if (!OCRResult.title.result || !OCRResult.mainStats.result || !OCRResult.subStats.result) {
      console.error('Missing OCR data'); // TODO: log this to the log area
      return;
    }

    // Log the OCR results
    console.log(relicRatingInfo);

    const mainRelicStats = OCRResult.mainStats.result;
    const subRelicStats = OCRResult.subStats.result;

    calulateRelicGrowthRate(mainRelicStats, subRelicStats);

    evaluateRelic(subRelicStats, relicRatingInfo);
  }, [OCRResult, relicRatingInfo]);

  function resetAll() {
    setOCRResult(null);
    setRelicTitle('');
    setRelicRatingInfo(null);
    setMainRelicStats(null);
    setSubRelicStats([]);
    setIsValuableRelic(false);
    setIsValuableMainStats(false);
    setIsMostValuableRelic(false);
    setIsValuableSubStats({
      1: false,
      2: false,
      3: false,
      4: false,
    });
    setRelicGrowthRate(null);
  }

  /**
   * Evaluate the relic
   * @param subRelicStats the sub relic stats
   * @param relicRatingInfo the relic rating info
   */
  function evaluateRelic(subRelicStats: RelicSubStats[], relicRatingInfo: RelicRatingInfo) {
    const configValuableSubStats = relicRatingInfo.valuableSub;
    const configShouldLockStats = relicRatingInfo.shouldLock;
    let isMostValuableRelic = false;

    setIsValuableMainStats(true);

    // extract the name from the subRelicStats
    const subStatsList = subRelicStats.map(stat => stat.name);

    // label the valuable sub stats
    const labeledSubStats = relicUtils.labelValuableSubStats(configValuableSubStats, subStatsList);

    // check if the relic is the most valuable relic
    if (
      relicUtils.isMostValuableRelic(
        configShouldLockStats,
        subStatsList,
        Object.values(labeledSubStats).filter(val => val).length
      )
    ) {
      isMostValuableRelic = true;
    }

    setIsMostValuableRelic(isMostValuableRelic);
    setIsValuableSubStats(labeledSubStats);

    // if the valuable sub stats is more than 1, then the relic is valuable
    if (Object.values(labeledSubStats).filter(val => val).length >= 1) {
      setIsValuableRelic(true);
    } else {
      setIsValuableRelic(false);
    }
  }

  /**
   * Calculate the relic growth rate
   * @param mainRelicStats the main relic stats
   * @param subRelicStats the sub relic stats
   */
  function calulateRelicGrowthRate(mainRelicStats: RelicMainStats, subRelicStats: RelicSubStats[]) {
    const relicGrowthRate = {
      minGrowthScore: 0,
      maxGrowthScore: 0,
      maxScore: 0,
    };

    // The relic can have 3-4 sub stats at level 0, each 3 levels will increase the score by 1
    relicGrowthRate.maxScore = mainRelicStats.level == 0 ? 4 : Math.floor(mainRelicStats.level / 3) + 4;

    // Calculate the current relic score
    for (let i = 0; i < subRelicStats.length; i++) {
      const subStat = subRelicStats[i];
      // the spd can have multiple scores
      if (subStat.score instanceof Array) {
        const maxScore = Math.max(...subStat.score);
        const minScore = Math.min(...subStat.score);
        relicGrowthRate.maxGrowthScore += maxScore;
        relicGrowthRate.minGrowthScore += minScore;
      } else {
        relicGrowthRate.maxGrowthScore += Number(subStat.score);
        relicGrowthRate.minGrowthScore += Number(subStat.score);
      }
    }

    console.log(relicGrowthRate);
    setRelicGrowthRate(relicGrowthRate);
  }

  /**
   * Capture the screen and crop the image
   */
  async function captureAndCropScreen() {
    const res = await (window as any).ipcRenderer.captureScreen();
    return res.crop({
      x: 1400,
      y: 0,
      width: 445,
      height: 800,
    });
  }

  /**
   * Process the OCR
   * @param imagePart the image mat to process
   * @param imageRef the image ref to display the image
   * @param ocrUtilFunction the OCR utility function to use
   */
  async function processOCR(
    imagePart: cv.Mat,
    imageRef: React.RefObject<HTMLCanvasElement>,
    ocrUtilFunction: (worker: Worker, image: string) => Promise<any>
  ) {
    if (imageRef.current) {
      cv.imshow(imageRef.current, imagePart);
      if (!worker) {
        console.error('worker is null'); // TODO: log this to the log area
        return;
      }
      return await ocrUtilFunction(worker, imageRef.current.toDataURL());
    } else {
      console.error('Image ref is not available'); // TODO: log this to the log area
    }
  }

  /**
   * Release the memory of the images
   * @param images the images to release
   */
  function releaseMemory(...images: cv.Mat[]) {
    images.forEach(image => image.delete());
  }

  const captureScreen = async () => {
    const croppedImage = await captureAndCropScreen();
    const croppedImageData = croppedImage.toDataURL();

    // if the image is not changed, do not process it
    if (currentImageRef.current === croppedImageData) {
      console.log('Image not changed');
      return;
    }

    resetAll();
    currentImageRef.current = croppedImageData;

    try {
      const imgRGB = await ImageUtils.img2MatRGB(croppedImage.toDataURL());
      const imgHSV = await ImageUtils.img2MatHSV(croppedImage.toDataURL());
      const maskedSourceImg = ImageUtils.applyFilter(imgHSV, imgRGB);

      // corp the image to the parts
      const maskedRelicTitle = ImageUtils.matCrop(maskedSourceImg, 0, 100, 445, 70);
      const maskedRelicMainStats = ImageUtils.matCrop(maskedSourceImg, 0, 392, 445, 50);
      const maskedRelicSubStats = ImageUtils.matCrop(maskedSourceImg, 0, 442, 445, 358);

      // Ensure the worker is initialized
      if (worker) {
        // get the OCR results
        const titleOCRResult = await processOCR(maskedRelicTitle, titlePartRef, OcrUtils.relicTitleExtractor);

        const mainStatsOCRResult = await processOCR(
          maskedRelicMainStats,
          mainStatsPartRef,
          OcrUtils.relicMainStatsExtractor
        );

        const subStatsOCRResult = await processOCR(
          maskedRelicSubStats,
          subStatsPartRef,
          OcrUtils.relicSubStatsExtractor
        );

        setOCRResult({
          title: titleOCRResult,
          mainStats: mainStatsOCRResult,
          subStats: subStatsOCRResult,
        });

        // check if the OCR results are available
        if (titleOCRResult?.result && mainStatsOCRResult?.result && subStatsOCRResult?.result) {
          setRelicTitle(titleOCRResult.result);
          setMainRelicStats(mainStatsOCRResult.result);
          setSubRelicStats(subStatsOCRResult.result);
        } else {
          console.error('OCR results are not available'); // TODO: log this to the
        }

        // prefetch the relic rating info
        const relicRatingInfo = await fetchRelicRatingInfo();
        setRelicRatingInfo(relicRatingInfo);
      } else {
        console.log('Worker not initialized'); // TODO: log this to the log area
      }

      releaseMemory(imgRGB, imgHSV, maskedSourceImg, maskedRelicTitle, maskedRelicMainStats, maskedRelicSubStats);
    } catch (e) {
      toast('未知问题，建议重启软件', { type: 'error' });
      console.error(e); // TODO: log this to the log area
    }
  };

  function renderTitleOCRResult(OCRResult: OCRResult) {
    if (OCRResult.title.error) {
      return (
        <div>
          <div>{OCRResult.title.error}</div>
        </div>
      );
    }

    return <div className="text-lg font-bold text-indigo-600">{OCRResult.title.result}</div>;
  }

  function renderMainStatsOCRResult(OCRResult: OCRResult) {
    if (OCRResult.mainStats.error) {
      return <div className="my-2 text-red-600">{OCRResult.mainStats.error}</div>;
    }

    if (!OCRResult.mainStats.result) {
      return (
        <div className="my-2 text-red-600">主属性为空, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进</div>
      );
    }

    return (
      <div
        className={cn('my-2 text-center font-semibold', {
          'text-green-600': isValuableMainStats,
          'text-red-600': !isValuableMainStats,
        })}
      >
        {OCRResult.mainStats.result.name} {OCRResult.mainStats.result.number} +{OCRResult.mainStats.result.level}
        <Badge
          className={cn('ml-2', {
            'bg-green-600': isValuableMainStats,
            'bg-red-600': !isValuableMainStats,
          })}
          onClick={handleToggleMainStat}
        >
          {isValuableMainStats ? '有效' : '无效'}
        </Badge>
      </div>
    );
  }

  function renderSubStatsOCRResult(OCRResult: OCRResult) {
    if (OCRResult.subStats.error) {
      return <div className="my-2 text-red-600">{OCRResult.subStats.error}</div>;
    }

    if (!OCRResult.subStats.result) {
      return (
        <div className="my-2 text-red-600">副属性为空, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进</div>
      );
    }

    return (
      <div className="my-2">
        <div className="grid grid-cols-4 gap-2 font-semibold">
          <div className="mb-1 mr-1">副属性</div>
          <div className="mb-1 mr-1">数值</div>
          <div className="mb-1 mr-1">分数</div>
          <div className="mb-1 mr-1">有效性</div>
        </div>
        {OCRResult.subStats.result.map((subStat, index) => (
          <div key={index} className="grid grid-cols-4 items-center gap-2">
            <div className="mb-1 overflow-hidden whitespace-nowrap">{subStat.name}</div>
            <div className="mb-1 overflow-hidden whitespace-nowrap">{subStat.number}</div>
            <div className="mb-1 overflow-hidden whitespace-nowrap">
              {Array.isArray(subStat.score) ? subStat.score.join(' | ') : subStat.score}
            </div>
            <div className="mb-1 text-center">
              <Badge
                className={cn({
                  'bg-green-600': isValuableSubStats[index + 1],
                  'bg-red-600': !isValuableSubStats[index + 1],
                })}
              >
                {isValuableSubStats[index + 1] ? '有效' : '无效'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Handle the toggle main stat
   */
  async function handleToggleMainStat() {
    if (!OCRResult) {
      toast('请先开始扫描遗器', { type: 'error' }); // TODO: log this to the log area
      return;
    }
    const relicTitle = OCRResult.title.result;
    const mainRelicStats = OCRResult.mainStats.result;

    if (!mainRelicStats || !relicTitle) {
      toast('无法获取遗器信息', { type: 'error' }); // TODO: log this to the log area
      return;
    }
    if (isValuableMainStats) {
      const result = await relicUtils.removeRelicRatingValuableMain(relicTitle, mainRelicStats.name);
      if (result.success) {
        setIsValuableMainStats(false);
        toast(result.message, { type: 'success' });
      } else {
        toast(result.message, { type: 'error' }); // TODO: log this to the log area
      }
    } else {
      const result = await relicUtils.addRelicRatingValuableMain(relicTitle, mainRelicStats.name);
      if (result.success) {
        setIsValuableMainStats(true);
        toast(result.message, { type: 'success' });
      } else {
        toast(result.message, { type: 'error' }); // TODO: log this to the log area
      }
    }
  }

  return (
    <div className="flex flex-col text-center">
      {OCRResult && (
        <div className="text-lg font-semibold">
          <Badge
            className={cn({
              'bg-yellow-600': isMostValuableRelic,
              'bg-green-600': isValuableRelic && !isMostValuableRelic,
              'bg-red-600': !isValuableRelic && !isMostValuableRelic,
            })}
          >
            {isMostValuableRelic ? '建议锁定' : isValuableRelic ? '可以保留' : '建议分解'}
          </Badge>
        </div>
      )}
      {OCRResult && renderTitleOCRResult(OCRResult)}
      <div className="my-2">
        {relicGrowthRate &&
          (relicGrowthRate.minGrowthScore === relicGrowthRate.maxGrowthScore ? (
            <div className="font-semibold">
              遗器成长值: {parseFloat(relicGrowthRate.minGrowthScore.toFixed(2))} /{' '}
              {parseFloat(relicGrowthRate.maxScore.toFixed(2))}
            </div>
          ) : (
            <div className="font-semibold">
              遗器成长值: {parseFloat(relicGrowthRate.minGrowthScore.toFixed(2))} -{' '}
              {parseFloat(relicGrowthRate.maxGrowthScore.toFixed(2))} /{' '}
              {parseFloat(relicGrowthRate.maxScore.toFixed(2))}
            </div>
          ))}
      </div>
      {OCRResult && renderMainStatsOCRResult(OCRResult)}
      {OCRResult && renderSubStatsOCRResult(OCRResult)}
    </div>
  );
};

export default ScanContent;
