import {Worker} from 'tesseract.js';
import statsRegs from "@/data/regex.ts";


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
                matchedStats.push({name, number})
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
                matchedStats.push({name, number})
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
