import ElectronStore from 'electron-store';
import {RelicType} from "../types.ts";

interface StoreData {
    data: {
        relicMainStatsLevel: {
            [index: string]: {
                base: number;
                step: number;
            }
        }
        relicSubStatsScore: {
            [index: string]: { [index: string]: number | number[] }
        }
        relicRating: {
            [index: string]: {
                [index: string]: {
                    valuableSub: string[]
                    shouldLock: string[][]
                }
            }
        }
    };
}

const relicMainStatsLevel = {
    [RelicType.HP]: {
        base: 112.896,
        step: 39.5136
    },
    [RelicType.ATK]: {
        base: 56,
        step: 19.7568
    },
    [RelicType.HPPercentage]: {
        base: 0.06912,
        step: 0.024192
    },
    [RelicType.ATKPercentage]: {
        base: 0.06912,
        step: 0.024192
    },
    [RelicType.DEFPercentage]: {
        base: 0.0864,
        step: 0.030240001
    },
    [RelicType.SPD]: {
        base: 4.032,
        step: 1.4
    },
    [RelicType.CRITRate]: {
        base: 0.05184,
        step: 0.018144
    },
    [RelicType.CRITDMG]: {
        base: 0.10368,
        step: 0.036288
    },
    [RelicType.BreakEffect]: {
        base: 0.10368,
        step: 0.036288
    },
    [RelicType.OutgoingHealingBoost]: {
        base: 0.055296,
        step: 0.019354
    },
    [RelicType.EnergyRegenerationRate]: {
        base: 0.031104,
        step: 0.010886001
    },
    [RelicType.EffectHitRate]: {
        base: 0.06912,
        step: 0.024192
    },
    [RelicType.PhysicalDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.FireDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.IceDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.LightningDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.WindDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.QuantumDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
    [RelicType.ImaginaryDMGBoost]: {
        base: 0.062208,
        step: 0.021773001
    },
}

const relicSubStatsScore = {
    [RelicType.HP]: {
        "33": 0.8,
        "38": 0.9,
        "42": 1.0,
        "67": 1.6,
        "71": 1.7,
        "76": 1.8,
        "80": 1.9,
        "84": 2.0,
        "101": 2.4,
        "105": 2.5,
        "110": 2.6,
        "114": 2.7,
        "118": 2.8,
        "122": 2.9,
        "127": 3.0,
        "135": 3.2,
        "139": 3.3,
        "143": 3.4,
        "148": 3.5,
        "152": 3.6,
        "156": 3.7,
        "160": 3.8,
        "165": 3.9,
        "169": 4.0,
        "173": 4.1,
        "177": 4.2,
        "182": 4.3,
        "186": 4.4,
        "190": 4.5,
        "194": 4.6,
        "198": 4.7,
        "203": 4.8,
        "207": 4.9,
        "211": 5.0,
        "215": 5.1,
        "220": 5.2,
        "224": 5.3,
        "228": 5.4,
        "232": 5.5,
        "237": 5.6,
        "241": 5.7,
        "245": 5.8,
        "249": 5.9,
        "254": 6.0,
    },
    [RelicType.ATK]: {
        "16": 0.8,
        "19": 0.9,
        "21": 1.0,
        "33": 1.6,
        "35": 1.7,
        "38": 1.8,
        "40": 1.9,
        "42": 2.0,
        "50": 2.4,
        "52": 2.5,
        "55": 2.6,
        "57": 2.7,
        "59": 2.8,
        "61": 2.9,
        "63": 3.0,
        "67": 3.2,
        "69": 3.3,
        "71": 3.4,
        "74": 3.5,
        "76": 3.6,
        "78": 3.7,
        "80": 3.8,
        "82": 3.9,
        "84": 4.0,
        "86": 4.1,
        "88": 4.2,
        "91": 4.3,
        "93": 4.4,
        "95": 4.5,
        "97": 4.6,
        "99": 4.7,
        "101": 4.8,
        "103": 4.9,
        "105": 5.0,
        "107": 5.1,
        "110": 5.2,
        "112": 5.3,
        "114": 5.4,
        "116": 5.5,
        "118": 5.6,
        "120": 5.7,
        "122": 5.8,
        "124": 5.9,
        "127": 6.0,
    },
    [RelicType.DEF]: {
        "16": 0.8,
        "19": 0.9,
        "21": 1.0,
        "33": 1.6,
        "35": 1.7,
        "38": 1.8,
        "40": 1.9,
        "42": 2.0,
        "50": 2.4,
        "52": 2.5,
        "55": 2.6,
        "57": 2.7,
        "59": 2.8,
        "61": 2.9,
        "63": 3.0,
        "67": 3.2,
        "69": 3.3,
        "71": 3.4,
        "74": 3.5,
        "76": 3.6,
        "78": 3.7,
        "80": 3.8,
        "82": 3.9,
        "84": 4.0,
        "86": 4.1,
        "88": 4.2,
        "91": 4.3,
        "93": 4.4,
        "95": 4.5,
        "97": 4.6,
        "99": 4.7,
        "101": 4.8,
        "103": 4.9,
        "105": 5.0,
        "107": 5.1,
        "110": 5.2,
        "112": 5.3,
        "114": 5.4,
        "116": 5.5,
        "118": 5.6,
        "120": 5.7,
        "122": 5.8,
        "124": 5.9,
        "127": 6.0,
    },
    [RelicType.HPPercentage]: {
        "3.4%": 0.8,
        "3.8%": 0.9,
        "4.3%": 1.0,
        "6.9%": 1.6,
        "7.3%": 1.7,
        "7.7%": 1.8,
        "8.2%": 1.9,
        "8.6%": 2.0,
        "10.3%": 2.4,
        "10.8%": 2.5,
        "11.2%": 2.6,
        "11.6%": 2.7,
        "12.0%": 2.8,
        "12.5%": 2.9,
        "12.9%": 3.0,
        "13.8%": 3.2,
        "14.2%": 3.3,
        "14.6%": 3.4,
        "15.1%": 3.5,
        "15.5%": 3.6,
        "15.9%": 3.7,
        "16.4%": 3.8,
        "16.8%": 3.9,
        "17.2%": 4.0,
        "17.7%": 4.1,
        "18.1%": 4.2,
        "18.5%": 4.3,
        "19.0%": 4.4,
        "19.4%": 4.5,
        "19.8%": 4.6,
        "20.3%": 4.7,
        "20.7%": 4.8,
        "21.1%": 4.9,
        "21.6%": 5.0,
        "22.0%": 5.1,
        "22.4%": 5.2,
        "22.8%": 5.3,
        "23.3%": 5.4,
        "23.7%": 5.5,
        "24.1%": 5.6,
        "24.6%": 5.7,
        "25.0%": 5.8,
        "25.4%": 5.9,
        "25.9%": 6.0,
    },
    [RelicType.ATKPercentage]: {
        "3.4%": 0.8,
        "3.8%": 0.9,
        "4.3%": 1.0,
        "6.9%": 1.6,
        "7.3%": 1.7,
        "7.7%": 1.8,
        "8.2%": 1.9,
        "8.6%": 2.0,
        "10.3%": 2.4,
        "10.8%": 2.5,
        "11.2%": 2.6,
        "11.6%": 2.7,
        "12.0%": 2.8,
        "12.5%": 2.9,
        "12.9%": 3.0,
        "13.8%": 3.2,
        "14.2%": 3.3,
        "14.6%": 3.4,
        "15.1%": 3.5,
        "15.5%": 3.6,
        "15.9%": 3.7,
        "16.4%": 3.8,
        "16.8%": 3.9,
        "17.2%": 4.0,
        "17.7%": 4.1,
        "18.1%": 4.2,
        "18.5%": 4.3,
        "19.0%": 4.4,
        "19.4%": 4.5,
        "19.8%": 4.6,
        "20.3%": 4.7,
        "20.7%": 4.8,
        "21.1%": 4.9,
        "21.6%": 5.0,
        "22.0%": 5.1,
        "22.4%": 5.2,
        "22.8%": 5.3,
        "23.3%": 5.4,
        "23.7%": 5.5,
        "24.1%": 5.6,
        "24.6%": 5.7,
        "25.0%": 5.8,
        "25.4%": 5.9,
        "25.9%": 6.0,
    },
    [RelicType.DEFPercentage]: {
        "4.3%": 0.8,
        "4.8%": 0.9,
        "5.4%": 1.0,
        "8.6%": 1.6,
        "9.1%": 1.7,
        "9.7%": 1.8,
        "10.2%": 1.9,
        "10.8%": 2.0,
        "12.9%": 2.4,
        "13.5%": 2.5,
        "14.0%": 2.6,
        "14.5%": 2.7,
        "15.1%": 2.8,
        "15.6%": 2.9,
        "16.2%": 3.0,
        "17.2%": 3.2,
        "17.8%": 3.3,
        "18.3%": 3.4,
        "18.9%": 3.5,
        "19.4%": 3.6,
        "19.9%": 3.7,
        "20.5%": 3.8,
        "21.0%": 3.9,
        "21.6%": 4.0,
        "22.1%": 4.1,
        "22.6%": 4.2,
        "23.2%": 4.3,
        "23.7%": 4.4,
        "24.3%": 4.5,
        "24.8%": 4.6,
        "25.3%": 4.7,
        "25.9%": 4.8,
        "26.4%": 4.9,
        "27.0%": 5.0,
        "27.5%": 5.1,
        "28.0%": 5.2,
        "28.6%": 5.3,
        "29.1%": 5.4,
        "29.7%": 5.5,
        "30.2%": 5.6,
        "30.7%": 5.7,
        "31.3%": 5.8,
        "31.8%": 5.9,
        "32.4%": 6.0,
    },
    [RelicType.SPD]: {
        "2": [0.8, 0.9, 1.0],
        "4": [1.6, 1.7, 1.8, 1.9],
        "5": 2.0,
        "6": [2.4, 2.5, 2.6, 2.7],
        "7": [2.8, 2.9, 3.0],
        "8": [3.2, 3.3, 3.4, 3.5],
        "9": [3.6, 3.7, 3.8],
        "10": [3.9, 4.0, 4.1, 4.2, 4.3],
        "11": [4.4, 4.5, 4.6],
        "12": [4.7, 4.8, 4.9, 5.0, 5.1],
        "13": [5.0, 5.2, 5.3, 5.4],
        "14": [5.5, 5.6, 5.7, 5.8, 5.9],
        "15": [5.8, 5.9, 6.0],
    },
    [RelicType.CRITRate]: {
        "2.5%": 0.8,
        "2.9%": 0.9,
        "3.2%": 1.0,
        "5.1%": 1.6,
        "5.5%": 1.7,
        "5.8%": 1.8,
        "6.1%": 1.9,
        "6.4%": 2.0,
        "7.7%": 2.4,
        "8.1%": 2.5,
        "8.4%": 2.6,
        "8.7%": 2.7,
        "9.0%": 2.8,
        "9.3%": 2.9,
        "9.7%": 3.0,
        "10.3%": 3.2,
        "10.6%": 3.3,
        "11.0%": 3.4,
        "11.3%": 3.5,
        "11.6%": 3.6,
        "11.9%": 3.7,
        "12.3%": 3.8,
        "12.6%": 3.9,
        "12.9%": 4.0,
        "13.2%": 4.1,
        "13.6%": 4.2,
        "13.9%": 4.3,
        "14.2%": 4.4,
        "14.5%": 4.5,
        "14.9%": 4.6,
        "15.2%": 4.7,
        "15.5%": 4.8,
        "15.8%": 4.9,
        "16.2%": 5.0,
        "16.5%": 5.1,
        "16.8%": 5.2,
        "17.1%": 5.3,
        "17.4%": 5.4,
        "17.8%": 5.5,
        "18.1%": 5.6,
        "18.4%": 5.7,
        "18.7%": 5.8,
        "19.1%": 5.9,
        "19.4%": 6.0,
    },
    [RelicType.CRITDMG]: {
        "5.1%": 0.8,
        "5.8%": 0.9,
        "6.4%": 1.0,
        "10.3%": 1.6,
        "11.0%": 1.7,
        "11.6%": 1.8,
        "12.3%": 1.9,
        "12.9%": 2.0,
        "15.5%": 2.4,
        "16.2%": 2.5,
        "16.8%": 2.6,
        "17.4%": 2.7,
        "18.1%": 2.8,
        "18.7%": 2.9,
        "19.4%": 3.0,
        "20.7%": 3.2,
        "21.3%": 3.3,
        "22.0%": 3.4,
        "22.6%": 3.5,
        "23.3%": 3.6,
        "23.9%": 3.7,
        "24.6%": 3.8,
        "25.2%": 3.9,
        "25.9%": 4.0,
        "26.5%": 4.1,
        "27.2%": 4.2,
        "27.8%": 4.3,
        "28.5%": 4.4,
        "29.1%": 4.5,
        "29.8%": 4.6,
        "30.4%": 4.7,
        "31.1%": 4.8,
        "31.7%": 4.9,
        "32.4%": 5.0,
        "33.0%": 5.1,
        "33.6%": 5.2,
        "34.3%": 5.3,
        "34.9%": 5.4,
        "35.6%": 5.5,
        "36.2%": 5.6,
        "36.9%": 5.7,
        "37.5%": 5.8,
        "38.2%": 5.9,
        "38.8%": 6.0,
    },
    [RelicType.EffectHitRate]: {
        "3.4%": 0.8,
        "3.8%": 0.9,
        "4.3%": 1.0,
        "6.9%": 1.6,
        "7.3%": 1.7,
        "7.7%": 1.8,
        "8.2%": 1.9,
        "8.6%": 2.0,
        "10.3%": 2.4,
        "10.8%": 2.5,
        "11.2%": 2.6,
        "11.6%": 2.7,
        "12.0%": 2.8,
        "12.5%": 2.9,
        "12.9%": 3.0,
        "13.8%": 3.2,
        "14.2%": 3.3,
        "14.6%": 3.4,
        "15.1%": 3.5,
        "15.5%": 3.6,
        "15.9%": 3.7,
        "16.4%": 3.8,
        "16.8%": 3.9,
        "17.2%": 4.0,
        "17.7%": 4.1,
        "18.1%": 4.2,
        "18.5%": 4.3,
        "19.0%": 4.4,
        "19.4%": 4.5,
        "19.8%": 4.6,
        "20.3%": 4.7,
        "20.7%": 4.8,
        "21.1%": 4.9,
        "21.6%": 5.0,
        "22.0%": 5.1,
        "22.4%": 5.2,
        "22.8%": 5.3,
        "23.3%": 5.4,
        "23.7%": 5.5,
        "24.1%": 5.6,
        "24.6%": 5.7,
        "25.0%": 5.8,
        "25.4%": 5.9,
        "25.9%": 6.0,
    },
    [RelicType.EffectRes]: {
        "3.4%": 0.8,
        "3.8%": 0.9,
        "4.3%": 1.0,
        "6.9%": 1.6,
        "7.3%": 1.7,
        "7.7%": 1.8,
        "8.2%": 1.9,
        "8.6%": 2.0,
        "10.3%": 2.4,
        "10.8%": 2.5,
        "11.2%": 2.6,
        "11.6%": 2.7,
        "12.0%": 2.8,
        "12.5%": 2.9,
        "12.9%": 3.0,
        "13.8%": 3.2,
        "14.2%": 3.3,
        "14.6%": 3.4,
        "15.1%": 3.5,
        "15.5%": 3.6,
        "15.9%": 3.7,
        "16.4%": 3.8,
        "16.8%": 3.9,
        "17.2%": 4.0,
        "17.7%": 4.1,
        "18.1%": 4.2,
        "18.5%": 4.3,
        "19.0%": 4.4,
        "19.4%": 4.5,
        "19.8%": 4.6,
        "20.3%": 4.7,
        "20.7%": 4.8,
        "21.1%": 4.9,
        "21.6%": 5.0,
        "22.0%": 5.1,
        "22.4%": 5.2,
        "22.8%": 5.3,
        "23.3%": 5.4,
        "23.7%": 5.5,
        "24.1%": 5.6,
        "24.6%": 5.7,
        "25.0%": 5.8,
        "25.4%": 5.9,
        "25.9%": 6.0,
    },
    [RelicType.BreakEffect]: {
        "5.1%": 0.8,
        "5.8%": 0.9,
        "6.4%": 1.0,
        "10.3%": 1.6,
        "11.0%": 1.7,
        "11.6%": 1.8,
        "12.3%": 1.9,
        "12.9%": 2.0,
        "15.5%": 2.4,
        "16.2%": 2.5,
        "16.8%": 2.6,
        "17.4%": 2.7,
        "18.1%": 2.8,
        "18.7%": 2.9,
        "19.4%": 3.0,
        "20.7%": 3.2,
        "21.3%": 3.3,
        "22.0%": 3.4,
        "22.6%": 3.5,
        "23.3%": 3.6,
        "23.9%": 3.7,
        "24.6%": 3.8,
        "25.2%": 3.9,
        "25.9%": 4.0,
        "26.5%": 4.1,
        "27.2%": 4.2,
        "27.8%": 4.3,
        "28.5%": 4.4,
        "29.1%": 4.5,
        "29.8%": 4.6,
        "30.4%": 4.7,
        "31.1%": 4.8,
        "31.7%": 4.9,
        "32.4%": 5.0,
        "33.0%": 5.1,
        "33.6%": 5.2,
        "34.3%": 5.3,
        "34.9%": 5.4,
        "35.6%": 5.5,
        "36.2%": 5.6,
        "36.9%": 5.7,
        "37.5%": 5.8,
        "38.2%": 5.9,
        "38.8%": 6.0,
    },
}

const MusketeerCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage
]

const MusketeerCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG]
]

const PrisonerCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.ATKPercentage, RelicType.SPD,
    RelicType.EffectHitRate
]

const PrisonerCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
    [RelicType.ATKPercentage, RelicType.EffectHitRate],
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const GlamothCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const GlamothCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const lzumoCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage
]

const lzumoCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const HertaCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const HertaCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
]

const IPCCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const IPCCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
    [RelicType.ATKPercentage, RelicType.EffectHitRate],
]

const DiscipleCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.HPPercentage
]

const DiscipleCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const GrandDukeCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.ATKPercentage, RelicType.DEFPercentage, RelicType.HPPercentage
]

const GrandDukeCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const ElementalCommonValuableSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.ATKPercentage, RelicType.DEFPercentage, RelicType.HPPercentage
]

const ElementalCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const XianZhouCommonValuableSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const XianZhouCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const VonwacqCommonValuableSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const VonwacqCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const PenaconyCommonValuableSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const PenaconyCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const BelobogCommonValuableSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectHitRate, RelicType.CRITRate, RelicType.CRITDMG
]

const BelobogCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.DEFPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
]

const TaliaCommonValuableSub = [
    RelicType.SPD, RelicType.BreakEffect
]

const TaliaCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect]
]

const SalsottoCommonValuableSub = [
    RelicType.SPD, RelicType.CRITDMG, RelicType.CRITRate, RelicType.ATKPercentage, RelicType.DEFPercentage, RelicType.HPPercentage
]

const SalsottoCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const TaikiyanCommonValuableSub = [
    RelicType.SPD, RelicType.CRITDMG, RelicType.CRITRate, RelicType.ATKPercentage, RelicType.DEFPercentage, RelicType.HPPercentage
]

const TaikiyanCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const SigoniaCommonValuableSub = [
    RelicType.SPD, RelicType.CRITDMG, RelicType.CRITRate, RelicType.ATKPercentage, RelicType.DEFPercentage, RelicType.HPPercentage
]

const SigoniaCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.CRITRate],
    [RelicType.SPD, RelicType.CRITDMG],
    [RelicType.ATKPercentage, RelicType.CRITRate],
    [RelicType.ATKPercentage, RelicType.CRITDMG],
]

const ThiefCommonValuableSub = [
    RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage
]

const ThiefCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.BreakEffect, RelicType.ATKPercentage],
]

const WatchmakerCommonValuableSub = [
    RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage
]

const WatchmakerCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.BreakEffect, RelicType.ATKPercentage],
]

const PasserbyCommonValuableSub = [
    RelicType.SPD, RelicType.HPPercentage, RelicType.EffectRes, RelicType.ATKPercentage
]

const PasserbyCommonShouldLock = [
    [RelicType.SPD, RelicType.HPPercentage],
]

const KnightCommonValuableSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectRes, RelicType.CRITDMG, RelicType.CRITRate
]

const KnightCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.DEFPercentage],
]

const GuardCommonValuableSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectRes, RelicType.EffectHitRate, RelicType.HPPercentage
]

const GuardCommonShouldLock = [
    [RelicType.SPD, RelicType.DEFPercentage],
]

const MessengerCommonValuableSub = [
    RelicType.SPD, RelicType.CRITRate, RelicType.CRITDMG, RelicType.ATKPercentage
]

const MessengerCommonShouldLock = [
    [RelicType.SPD, RelicType.CRITDMG],
]

const InsumousuCommonValuableSub = [
    RelicType.SPD, RelicType.EffectRes, RelicType.CRITDMG, RelicType.CRITRate
]

const InsumousuCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.EffectRes],
]

const relicRating = {
    'Musketeer\'s Wild Wheat Felt Hat': {
        [RelicType.HP]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Coarse Leather Gloves': {
        [RelicType.ATK]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Wind-Hunting Shawl': {
        [RelicType.CRITRate]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: [
                [RelicType.CRITRate, RelicType.CRITDMG],
                [RelicType.SPD, RelicType.ATKPercentage]
            ]
        },
        [RelicType.EffectHitRate]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Rivets Riding Boots': {
        [RelicType.SPD]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: MusketeerCommonValuableSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Prisoner\'s Sealed Muzzle': {
        [RelicType.HP]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Prisoner\'s Leadstone Shackles': {
        [RelicType.ATK]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Prisoner\'s Repressive Straitjacket': {
        [RelicType.CRITRate]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        },
    },
    'Prisoner\'s Restrictive Fetters': {
        [RelicType.SPD]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: PrisonerCommonValuableSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Glamoth\'s Iron Cavalry Regiment': {
        [RelicType.ATKPercentage]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        }
    },
    'Glamoth\'s Silent Tombstone': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: GlamothCommonValuableSub,
            shouldLock: GlamothCommonShouldLock
        },
    },
    'lzumo\'s Magatsu no Morokami': {
        [RelicType.ATKPercentage]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        }
    },
    'lzumo\'s Blades of Origin and End': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: lzumoCommonValuableSub,
            shouldLock: lzumoCommonShouldLock
        },
    },
    'Herta\'s Space Station': {
        [RelicType.ATKPercentage]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        }
    },
    'Herta\'s Wandering Trek': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: HertaCommonValuableSub,
            shouldLock: HertaCommonShouldLock
        },
    },
    'The IPC\'s Mega HQ': {
        [RelicType.ATKPercentage]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        }
    },
    'The IPC\'s Trade Route': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: IPCCommonValuableSub,
            shouldLock: IPCCommonShouldLock
        },
    },
    'Disciple\'s Prosthetic Eye': {
        [RelicType.HP]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Ingenium Hand': {
        [RelicType.ATK]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Dewy Feather Garb': {
        [RelicType.CRITRate]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Celestial Silk Sandals': {
        [RelicType.SPD]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: DiscipleCommonValuableSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Grand Duke\'s Crown of Netherflame': {
        [RelicType.HP]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Gloves of Fieryfur': {
        [RelicType.ATK]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Robe of Grace': {
        [RelicType.CRITRate]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Ceremonial Boots': {
        [RelicType.SPD]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: GrandDukeCommonValuableSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Pioneer\'s Heatproof Shell': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Lacuna Compass': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Sealed Lead Apron': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Starfaring Anchor': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Artaius Hood': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Lizard Gloves': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Ice Dragon Cloak': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Soft Elkskin Boots': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Headgear': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Heavy Gloves': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Chest Guard': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Fleetfoot Boots': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Obsidian Goggles': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Ring of Flame-Mastery': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Fireproof Apron': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Alloy Leg': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Ultraremote Sensing Visor': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Frequency Catcher': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Metafield Suit': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Gravity Walker': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Polarized Sunglasses': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Touring Bracelet': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Leather Jacket With Studs': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Ankle Boots With Rivets': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Beaked Helmet': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Soaring Ring': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Winged Suit Harness': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Quilted Puttees': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Breathing Mask': {
        [RelicType.HP]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Desert Terminal': {
        [RelicType.ATK]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Friar Robe': {
        [RelicType.CRITRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Powered Greaves': {
        [RelicType.SPD]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ElementalCommonValuableSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'The Xianzhou Luofu\'s Celestial Ark': {
        [RelicType.ATKPercentage]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        }
    },
    'The Xianzhou Luofu\'s Ambrosial Arbor Vines': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: XianZhouCommonValuableSub,
            shouldLock: XianZhouCommonShouldLock
        },
    },
    'Vonwacq\'s Island of Birth': {
        [RelicType.ATKPercentage]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        }
    },
    'Vonwacq\'s Islandic Coast': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: VonwacqCommonValuableSub,
            shouldLock: VonwacqCommonShouldLock
        }
    },
    'Penacony\'s Grand Hotel': {
        [RelicType.ATKPercentage]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        }
    },
    'Penacony\'s Dream-Seeking Tracks': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: PenaconyCommonValuableSub,
            shouldLock: PenaconyCommonShouldLock
        }
    },
    'Belobog\'s Fortress of Preservation': {
        [RelicType.DEFPercentage]: {
            valuableSub: BelobogCommonValuableSub,
            shouldLock: BelobogCommonShouldLock
        }
    },
    'Belobog\'s Iron Defense': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: BelobogCommonValuableSub,
            shouldLock: BelobogCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: BelobogCommonValuableSub,
            shouldLock: BelobogCommonShouldLock
        }
    },
    'Talia\'s Nailscrap Town': {
        [RelicType.DEFPercentage]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        }
    },
    'Talia\'s Exposed Electric Wire': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            valuableSub: TaliaCommonValuableSub,
            shouldLock: TaliaCommonShouldLock
        }
    },
    'Salsotto\'s Moving City': {
        [RelicType.DEFPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        }
    },
    'Salsotto\'s Terminator Line': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: SalsottoCommonValuableSub,
            shouldLock: SalsottoCommonShouldLock
        },
    },
    'Taikiyan Laser Stadium': {
        [RelicType.DEFPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        }
    },
    'Taikiyan\'s Arclight Race Track': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: TaikiyanCommonValuableSub,
            shouldLock: TaikiyanCommonShouldLock
        },
    },
    'Sigonia\'s Gaiathra Berth': {
        [RelicType.DEFPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        }
    },
    'Sigonia\'s Knot of Cyclicality': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: SigoniaCommonValuableSub,
            shouldLock: SigoniaCommonShouldLock
        },
    },
    'Thief\'s Myriad-Faced Mask': {
        [RelicType.HP]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Gloves With Prints': {
        [RelicType.ATK]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Steel Grappling Hook': {
        [RelicType.CRITRate]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Meteor Boots': {
        [RelicType.SPD]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: ThiefCommonValuableSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Watchmaker\'s Telescoping Lens': {
        [RelicType.HP]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Fortuitous Wristwatch': {
        [RelicType.ATK]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Illusory Formal Suit': {
        [RelicType.CRITRate]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Dream-Concealing Dress Shoes': {
        [RelicType.SPD]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: WatchmakerCommonValuableSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Passerby\'s Rejuvenated Wooden Hairstick': {
        [RelicType.HP]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Roaming Dragon Bracer': {
        [RelicType.ATK]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Ragged Embroided Coat': {
        [RelicType.OutgoingHealingBoost]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Stygian Hiking Boots': {
        [RelicType.SPD]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: PasserbyCommonValuableSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Knight\'s Forgiving Casque': {
        [RelicType.HP]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Silent Oath Ring': {
        [RelicType.ATK]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Solemn Breastplate': {
        [RelicType.HPPercentage]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Iron Boots of Order': {
        [RelicType.SPD]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: KnightCommonValuableSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Guard\'s Cast Iron Helmet': {
        [RelicType.HP]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Shining Gauntlets': {
        [RelicType.ATK]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Uniform of Old': {
        [RelicType.HPPercentage]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Silver Greaves': {
        [RelicType.SPD]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: GuardCommonValuableSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Messenger\'s Holovisor': {
        [RelicType.HP]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Transformative Arm': {
        [RelicType.ATK]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Secret Satchel': {
        [RelicType.HPPercentage]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.CRITRate]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Par-kool Sneakers': {
        [RelicType.SPD]: {
            valuableSub: MessengerCommonValuableSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Insumousu\'s Whalefall Ship': {
        [RelicType.ATKPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        }
    },
    'Insumousu\'s Frayed Hawser': {
        [RelicType.EnergyRegenerationRate]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            valuableSub: InsumousuCommonValuableSub,
            shouldLock: InsumousuCommonShouldLock
        },
    }

}

const store = new ElectronStore<StoreData>({
    defaults: {
        data: {
            relicMainStatsLevel: relicMainStatsLevel,
            relicSubStatsScore: relicSubStatsScore,
            relicRating: relicRating,
        }
    }
});

export default store;
