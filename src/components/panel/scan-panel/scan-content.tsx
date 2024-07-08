import cv from '@techstark/opencv-js';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { createWorker, Worker } from 'tesseract.js';

import CharacterRatingBadge from '@/components/panel/scan-panel/character-rating-badge.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import useRelicStore from '@/hooks/use-relic-store.ts';
import { CharacterBasePartRating, OCRResult, RelicMainStats, RelicSubStats } from '@/type/types.ts';
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
  const { setRelicTitle, setMainRelicStats, setSubRelicStats } = useRelicStore(state => ({
    setRelicTitle: state.setRelicTitle,
    setMainRelicStats: state.setMainRelicStats,
    setSubRelicStats: state.setSubRelicStats,
  }));

  const [worker, setWorker] = useState<Worker | null>(null);
  const [workerInitialized, setWorkerInitialized] = useState(false);
  const currentImageRef = useRef<string | null>(null);
  const [relicGrowthRate, setRelicGrowthRate] = useState<{
    minGrowthScore: number;
    maxGrowthScore: number;
    maxScore: number;
  } | null>(null);
  const [OCRResult, setOCRResult] = useState<OCRResult | null>(null);
  const [characterBasePartRatingList, setCharacterBasePartRatingList] = useState<CharacterBasePartRating[]>([]);

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
    if (!OCRResult) {
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

    const relicTitle = OCRResult.title.result;
    const mainRelicStats = OCRResult.mainStats.result;
    const subRelicStats = OCRResult.subStats.result;

    calculateRelicGrowthRate(mainRelicStats, subRelicStats);

    evaluateRelic(relicTitle, mainRelicStats, subRelicStats);
  }, [OCRResult]);

  function resetAll() {
    setOCRResult(null);
    setRelicTitle('');
    setMainRelicStats(null);
    setSubRelicStats([]);
    setCharacterBasePartRatingList([]);
    setRelicGrowthRate(null);
  }

  /**
   * Evaluate the relic
   * @param relicTitle the relic title which is the part name
   * @param mainRelicStat the main relic stats
   * @param subRelicStats the sub relic stats
   */
  function evaluateRelic(relicTitle: string, mainRelicStat: RelicMainStats, subRelicStats: RelicSubStats[]) {
    // get the relic rating rules
    const ratingRules = relicUtils.getRelicRatingRules(relicTitle, mainRelicStat.name);

    if (!ratingRules.success) {
      toast(ratingRules.message, { type: 'error' });
      return;
    }

    // if the rating rules empty, return
    if (ratingRules.rules.length === 0) {
      return;
    }

    const characterBasePartRatingList: CharacterBasePartRating[] = [];
    // iterate through the rules calculate the valuable stats, score for each character
    ratingRules.rules.forEach(rule => {
      const valuableSub = rule.valuableSub;
      const character = rule.fitCharacters;

      const top4ValuableSub = relicUtils.getTop4ValuableSubScore(valuableSub);
      const totalPossibleScore = relicUtils.getTotalPossibleScore(mainRelicStat, top4ValuableSub);

      // calculate the rating with the new model
      const newRating: CharacterBasePartRating = relicUtils.getCharacterBasePartRating(
        character,
        totalPossibleScore,
        subRelicStats,
        valuableSub
      );

      if (Object.values(newRating.valuableSub).some(subStat => subStat.valuable)) {
        characterBasePartRatingList.push(newRating);
      }
    });

    // sort the characterBasePartRatingList
    characterBasePartRatingList.sort((a, b) => a.totalScore / a.maxTotalScore - b.totalScore / b.maxTotalScore);
    setCharacterBasePartRatingList(characterBasePartRatingList);
  }

  /**
   * Calculate the relic growth rate
   * @param mainRelicStats the main relic stats
   * @param subRelicStats the sub relic stats
   */
  function calculateRelicGrowthRate(mainRelicStats: RelicMainStats, subRelicStats: RelicSubStats[]) {
    const relicGrowthRate = {
      minGrowthScore: 0,
      maxGrowthScore: 0,
      // The relic can have 3-4 sub stats at level 0,
      // each 3 levels increase the score by 1
      maxScore: mainRelicStats.enhanceLevel + 4,
    };

    // Calculate the current relic score
    for (const element of subRelicStats) {
      const subStat = element;
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

    relicGrowthRate.maxGrowthScore = parseFloat(relicGrowthRate.maxGrowthScore.toFixed(2));
    relicGrowthRate.minGrowthScore = parseFloat(relicGrowthRate.minGrowthScore.toFixed(2));

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
      const maskedRelicMainStats = ImageUtils.matCrop(maskedSourceImg, 35, 392, 445, 50);
      const maskedRelicSubStats = ImageUtils.matCrop(maskedSourceImg, 34, 442, 445, 358);

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
      } else {
        console.log('Worker not initialized'); // TODO: log this to the log area
      }

      releaseMemory(imgRGB, imgHSV, maskedSourceImg, maskedRelicTitle, maskedRelicMainStats, maskedRelicSubStats);
    } catch (e) {
      toast('未知问题，建议重启软件', { type: 'error' });
      console.error(e); // TODO: log this to the log area
    }
  };

  const renderOCRResult = () => {
    if (!OCRResult) {
      return <div className="font-semibold">选择模板后,开始扫描，显示遗器扫描内容</div>;
    }

    return (
      <div className="mt-2 flex flex-col gap-2">
        {OCRResult.title.error ? (
          <div className="text-red-600">{OCRResult.title.error}</div>
        ) : (
          <div className="font-black text-indigo-700">{OCRResult.title.result}</div>
        )}
        {OCRResult.mainStats.error && <div className="text-red-600">{OCRResult.mainStats.error}</div>}
        {!OCRResult.mainStats.error && OCRResult.mainStats.result && (
          <div className="flex items-center justify-center gap-2 font-semibold">
            {OCRResult.mainStats.result.name}: {OCRResult.mainStats.result.number}
            <Badge>{OCRResult.mainStats.result.level}级</Badge>
          </div>
        )}
        <Separator />
        {OCRResult.subStats.error && <div className="text-red-600">{OCRResult.subStats.error}</div>}
        {OCRResult.subStats.result ? (
          <div className="flex flex-col gap-2">
            {OCRResult.subStats.result.map(subStat => (
              <div key={subStat.name} className="flex items-center justify-center gap-2 font-semibold">
                {subStat.name}: {subStat.number}
                <Badge>{subStat.score instanceof Array ? subStat.score.join(' | ') : subStat.score}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div>暂无</div>
        )}
      </div>
    );
  };

  const renderRelicGrowthRate = () => {
    if (!relicGrowthRate) {
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <span className="font-semibold">遗器成长率: </span>
        <Badge className={'inline-flex flex-row gap-2'}>
          <span>
            {relicGrowthRate.maxGrowthScore === relicGrowthRate.minGrowthScore
              ? relicGrowthRate.maxGrowthScore
              : `${relicGrowthRate.minGrowthScore} - ${relicGrowthRate.maxGrowthScore}`}
          </span>
          <span> / </span>
          <span>{relicGrowthRate.maxScore}</span>
        </Badge>
      </div>
    );
  };

  const renderCharacterBasePartRatingList = () => {
    if (characterBasePartRatingList.length === 0) {
      return <div className="font-semibold">暂无适用角色评分</div>;
    }

    return (
      <ScrollArea className="h-[300px]">
        <div className="flex flex-col gap-2">
          {characterBasePartRatingList.map((rating, index) => (
            <CharacterRatingBadge characterRating={rating} key={index} />
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="flex w-full flex-row gap-2 text-center">
      <div className="w-1/2">
        {renderRelicGrowthRate()}
        {renderOCRResult()}
      </div>
      <div className="w-1/2">{renderCharacterBasePartRatingList()}</div>
    </div>
  );
};

export default ScanContent;
