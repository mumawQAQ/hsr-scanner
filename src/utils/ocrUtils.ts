import { Worker } from 'tesseract.js';

import { RelicType } from '../type/types.ts';

import statsRegs from '@/data/regex.ts';
import { FuzzyPartNames } from '@/data/relic-parts-data.ts';

const fixRelicType = (number: string, srcType: RelicType) => {
  if (number.endsWith('%')) {
    if (srcType === RelicType.DEF) {
      return RelicType.DEFPercentage;
    } else if (srcType === RelicType.HP) {
      return RelicType.HPPercentage;
    } else if (srcType === RelicType.ATK) {
      return RelicType.ATKPercentage;
    }
  }
  return srcType;
};

const relicStatsNumberExtractor = (statsText: string) => {
  const match = statsText.match(/(\d+(\.\d+)?%?)/);
  return match ? match[0] : null;
};

const relicTitleExtractor = async (worker: Worker, image: string) => {
  try {
    let {
      data: { text: titleText },
    } = await worker.recognize(image);
    if (!titleText) {
      return {
        result: null,
        error: '没有检测到标题, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    // replace any ’ with '
    titleText = titleText.replace('’', "'");

    // remove any new line characters
    titleText = titleText.replace(/\n/g, ' ');

    // trim the text
    titleText = titleText.trim();

    const fuzzyTitleResult = FuzzyPartNames.get(titleText);

    if (!fuzzyTitleResult || fuzzyTitleResult.length === 0) {
      return {
        result: null,
        error: '未能识别标题, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    return {
      result: fuzzyTitleResult[0][1],
      error: null,
    };
  } catch (e) {
    console.error('Error during OCR processing:', e);
    throw e;
  }
};

const relicMainStatsExtractor = async (worker: Worker, image: string) => {
  try {
    const {
      data: { text: mainStatsText },
    } = await worker.recognize(image);
    const matchedStats = [];

    // TODO: When HP is 112 then it is recognized as 12, need to fix this

    // match the main stats from the reg expressions
    for (const { name, reg } of statsRegs.mainStatsRegs) {
      const match = mainStatsText.match(reg);
      if (match) {
        // extract the number from the matched text
        const number = relicStatsNumberExtractor(match[0]);
        if (!number) {
          continue;
        }
        // fix the relic type if the number is a percentage
        const fixedType = fixRelicType(number, name);

        // calculate the level of the main stat
        const { base, step } = await (window as any).ipcRenderer.storeGet(`data.relicMainStatsLevel.${fixedType}`);

        // if number end with %, then get its value
        const actualNum = number.endsWith('%') ? parseFloat(number) / 100 : parseFloat(number);
        const level = Math.ceil((actualNum - base) / step);

        matchedStats.push({ name: fixedType, number: number, level: level });
      }
    }

    if (matchedStats.length === 0) {
      return {
        result: matchedStats,
        error: '没有检测到足够的主属性，如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    if (matchedStats.length > 1) {
      return {
        result: matchedStats,
        error: '检测到异常数量的主属性, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    return {
      result: matchedStats[0],
      error: null,
    };
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw error;
  }
};

const relicSubStatsExtractor = async (worker: Worker, image: string) => {
  try {
    const {
      data: { text: subStatsText },
    } = await worker.recognize(image);
    const matchedStats = [];

    // match the sub stats from the reg expressions
    for (const { name, reg } of statsRegs.subStatsRegs) {
      const match = subStatsText.match(reg);
      if (match) {
        // extract the number from the matched text
        const number = relicStatsNumberExtractor(match[0]);

        if (!number) {
          continue;
        }
        // fix the relic type if the number is a percentage
        const fixedType = fixRelicType(number, name);
        // calculate the score of the sub stat'
        const score = (await (window as any).ipcRenderer.storeGet(`data.relicSubStatsScore.${fixedType}`))[number];

        // const score = relic.relicSubStatsScore[fixedType][number]
        matchedStats.push({ name: fixedType, number: number, score: score });
      }
    }

    if (matchedStats.length < 3) {
      return {
        result: matchedStats,
        error: '没有检测到足够的副属性, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    if (matchedStats.length > 4) {
      return {
        result: matchedStats,
        error: '检测到异常数量的副属性, 如果右侧图像捕获正确，请向GitHub提交Issue以帮助我们改进',
      };
    }

    return {
      result: matchedStats,
      error: null,
    };
  } catch (error) {
    console.error('Error during OCR processing:', error);
    throw error;
  }
};

export default {
  relicTitleExtractor,
  relicMainStatsExtractor,
  relicSubStatsExtractor,
};
