import {Worker} from 'tesseract.js';
import statsRegs from "@/data/regex.ts";
import relic from "@/data/relic.ts";
import {RelicType} from "@/types.ts";


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
}

const relicStatsNumberExtractor = (statsText: string) => {
    const match = statsText.match(/(\d+(\.\d+)?%?)/);
    return match ? match[0] : null;
}

const relicTitleExtractor = async (worker: Worker, image: string) => {
    try {
        const {data: {text: titleText}} = await worker.recognize(image);
        return titleText;
    } catch (e) {
        console.error('Error during OCR processing:', e);
        throw e;
    }
}

const relicMainStatsExtractor = async (worker: Worker, image: string) => {
    try {
        const {data: {text: mainStatsText}} = await worker.recognize(image);
        const matchedStats = [];

        // match the main stats from the reg expressions
        for (const {name, reg} of statsRegs.mainStatsRegs) {
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
                const {base, step} = relic.relicMainStatsLevel[fixedType]

                // if number end with %, then get its value
                const actualNum = number.endsWith('%') ? parseFloat(number) / 100 : parseFloat(number)
                const level = Math.ceil((actualNum - base) / step)

                matchedStats.push({name: fixedType, number: number, level: level})
            }
        }

        if (matchedStats.length === 0) {
            return {
                result: matchedStats,
                error: 'No main stats found'
            }
        }

        if (matchedStats.length > 1) {
            return {
                result: matchedStats,
                error: 'Multiple main stats found'
            }
        }

        return {
            result: matchedStats,
            error: null
        }
    } catch (error) {
        console.error('Error during OCR processing:', error);
        throw error;
    }
}


const relicSubStatsExtractor = async (worker: Worker, image: string) => {
    try {
        const {data: {text: subStatsText}} = await worker.recognize(image);
        const matchedStats = [];

        // match the sub stats from the reg expressions
        for (const {name, reg} of statsRegs.subStatsRegs) {
            const match = subStatsText.match(reg);
            if (match) {
                // extract the number from the matched text
                const number = relicStatsNumberExtractor(match[0]);

                if (!number) {
                    continue;
                }
                // fix the relic type if the number is a percentage
                const fixedType = fixRelicType(number, name);
                // calculate the score of the sub stat
                const score = relic.relicSubStatsScore[fixedType][number]
                matchedStats.push({name: fixedType, number: number, score: score})
            }
        }

        if (matchedStats.length < 3) {
            return {
                result: matchedStats,
                error: 'Not enough sub stats found'
            }
        }

        if (matchedStats.length > 4) {
            return {
                result: matchedStats,
                error: 'Too many sub stats found'
            }
        }

        return {
            result: matchedStats,
            error: null
        }
    } catch (error) {
        console.error('Error during OCR processing:', error);
        throw error;
    }
}


export default {
    relicTitleExtractor,
    relicMainStatsExtractor,
    relicSubStatsExtractor
}
