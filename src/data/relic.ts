import {RelicType} from "@/types.ts";

export interface RelicSubStatsScore {
    [index: string]: { [index: string]: number | number[] }
}

export interface RelicMainStatsLevel {
    [index: string]: { base: number, step: number }
}

export interface RelicRating {
    [index: string]: {
        [index: string]: {
            validSub: string[]
            shouldLock: string[][]
        }
    }
}

const relicMainStatsLevel: RelicMainStatsLevel = {
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

const relicSubStatsScore: RelicSubStatsScore = {
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


const MusketeerCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage
]

const MusketeerCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG]
]

const PrisonerCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.SPD, RelicType.ATKPercentage,
    RelicType.EffectHitRate
]

const PrisonerCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
    [RelicType.ATKPercentage, RelicType.EffectHitRate],
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const GlamothCommonValidSub = [
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

const lzumoCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage
]

const lzumoCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const HertaCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const HertaCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
]

const IPCCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const IPCCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
    [RelicType.ATKPercentage, RelicType.EffectHitRate],
]

const DiscipleCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.HPPercentage
]

const DiscipleCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
]

const GrandDukeCommonValidSub = [
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

const ElementalCommonValidSub = [
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

const XianZhouCommonValidSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const XianZhouCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const VonwacqCommonValidSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const VonwacqCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const PenaconyCommonValidSub = [
    RelicType.SPD, RelicType.ATKPercentage
]

const PenaconyCommonShouldLock = [
    [RelicType.SPD, RelicType.ATKPercentage]
]

const BelobogCommonValidSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectHitRate, RelicType.CRITRate, RelicType.CRITDMG
]

const BelobogCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.DEFPercentage],
    [RelicType.SPD, RelicType.EffectHitRate],
]

const TaliaCommonValidSub = [
    RelicType.SPD, RelicType.BreakEffect
]

const TaliaCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect]
]

const SalsottoCommonValidSub = [
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

const TaikiyanCommonValidSub = [
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

const SigoniaCommonValidSub = [
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

const ThiefCommonValidSub = [
    RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage
]

const ThiefCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.BreakEffect, RelicType.ATKPercentage],
]

const WatchmakerCommonValidSub = [
    RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage
]

const WatchmakerCommonShouldLock = [
    [RelicType.SPD, RelicType.BreakEffect],
    [RelicType.SPD, RelicType.ATKPercentage],
    [RelicType.BreakEffect, RelicType.ATKPercentage],
]

const PasserbyCommonValidSub = [
    RelicType.SPD, RelicType.HPPercentage, RelicType.EffectRes, RelicType.ATKPercentage
]

const PasserbyCommonShouldLock = [
    [RelicType.SPD, RelicType.HPPercentage],
]

const KnightCommonValidSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectRes, RelicType.CRITDMG, RelicType.CRITRate
]

const KnightCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.DEFPercentage],
]

const GuardCommonValidSub = [
    RelicType.SPD, RelicType.DEFPercentage, RelicType.EffectRes, RelicType.EffectHitRate, RelicType.HPPercentage
]

const GuardCommonShouldLock = [
    [RelicType.SPD, RelicType.DEFPercentage],
]

const MessengerCommonValidSub = [
    RelicType.SPD, RelicType.CRITRate, RelicType.CRITDMG, RelicType.ATKPercentage
]

const MessengerCommonShouldLock = [
    [RelicType.SPD, RelicType.CRITDMG],
]

const InsumousuCommonValidSub = [
    RelicType.SPD, RelicType.EffectRes, RelicType.CRITDMG, RelicType.CRITRate
]

const InsumousuCommonShouldLock = [
    [RelicType.CRITRate, RelicType.CRITDMG],
    [RelicType.SPD, RelicType.EffectRes],
]

const relicRating: RelicRating = {
    'Musketeer\'s Wild Wheat Felt Hat': {
        [RelicType.HP]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Coarse Leather Gloves': {
        [RelicType.ATK]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Wind-Hunting Shawl': {
        [RelicType.CRITRate]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: [
                [RelicType.CRITRate, RelicType.CRITDMG],
                [RelicType.SPD, RelicType.ATKPercentage]
            ]
        },
        [RelicType.EffectHitRate]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Musketeer\'s Rivets Riding Boots': {
        [RelicType.SPD]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: MusketeerCommonValidSub,
            shouldLock: MusketeerCommonShouldLock
        }
    },
    'Prisoner\'s Sealed Muzzle': {
        [RelicType.HP]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Prisoner\'s Leadstone Shackles': {
        [RelicType.ATK]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Prisoner\'s Repressive Straitjacket': {
        [RelicType.CRITRate]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        },
    },
    'Prisoner\'s Restrictive Fetters': {
        [RelicType.SPD]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: PrisonerCommonValidSub,
            shouldLock: PrisonerCommonShouldLock
        }
    },
    'Glamoth\'s Iron Cavalry Regiment': {
        [RelicType.ATKPercentage]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        }
    },
    'Glamoth\'s Silent Tombstone': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: GlamothCommonValidSub,
            shouldLock: GlamothCommonShouldLock
        },
    },
    'lzumo\'s Magatsu no Morokami': {
        [RelicType.ATKPercentage]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        }
    },
    'lzumo\'s Blades of Origin and End': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: lzumoCommonValidSub,
            shouldLock: lzumoCommonShouldLock
        },
    },
    'Herta\'s Space Station': {
        [RelicType.ATKPercentage]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        }
    },
    'Herta\'s Wandering Trek': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: HertaCommonValidSub,
            shouldLock: HertaCommonShouldLock
        },
    },
    'The IPC\'s Mega HQ': {
        [RelicType.ATKPercentage]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        }
    },
    'The IPC\'s Trade Route': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: IPCCommonValidSub,
            shouldLock: IPCCommonShouldLock
        },
    },
    'Disciple\'s Prosthetic Eye': {
        [RelicType.HP]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Ingenium Hand': {
        [RelicType.ATK]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Dewy Feather Garb': {
        [RelicType.CRITRate]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Disciple\'s Celestial Silk Sandals': {
        [RelicType.SPD]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: DiscipleCommonValidSub,
            shouldLock: DiscipleCommonShouldLock
        }
    },
    'Grand Duke\'s Crown of Netherflame': {
        [RelicType.HP]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Gloves of Fieryfur': {
        [RelicType.ATK]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Robe of Grace': {
        [RelicType.CRITRate]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Grand Duke\'s Ceremonial Boots': {
        [RelicType.SPD]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: GrandDukeCommonValidSub,
            shouldLock: GrandDukeCommonShouldLock
        }
    },
    'Pioneer\'s Heatproof Shell': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Lacuna Compass': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Sealed Lead Apron': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Pioneer\'s Starfaring Anchor': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Artaius Hood': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Lizard Gloves': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Ice Dragon Cloak': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Hunter\'s Soft Elkskin Boots': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Headgear': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Heavy Gloves': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Chest Guard': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Champion\'s Fleetfoot Boots': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Obsidian Goggles': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Ring of Flame-Mastery': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Fireproof Apron': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Firesmith\'s Alloy Leg': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Ultraremote Sensing Visor': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Frequency Catcher': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Metafield Suit': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Genius\'s Gravity Walker': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Polarized Sunglasses': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Touring Bracelet': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Leather Jacket With Studs': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Band\'s Ankle Boots With Rivets': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Beaked Helmet': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Soaring Ring': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Winged Suit Harness': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Eagle\'s Quilted Puttees': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Breathing Mask': {
        [RelicType.HP]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Desert Terminal': {
        [RelicType.ATK]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Friar Robe': {
        [RelicType.CRITRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'Wastelander\'s Powered Greaves': {
        [RelicType.SPD]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ElementalCommonValidSub,
            shouldLock: ElementalCommonShouldLock
        }
    },
    'The Xianzhou Luofu\'s Celestial Ark': {
        [RelicType.ATKPercentage]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        }
    },
    'The Xianzhou Luofu\'s Ambrosial Arbor Vines': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: XianZhouCommonValidSub,
            shouldLock: XianZhouCommonShouldLock
        },
    },
    'Vonwacq\'s Island of Birth': {
        [RelicType.ATKPercentage]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        }
    },
    'Vonwacq\'s Islandic Coast': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: VonwacqCommonValidSub,
            shouldLock: VonwacqCommonShouldLock
        }
    },
    'Penacony\'s Grand Hotel': {
        [RelicType.ATKPercentage]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        }
    },
    'Penacony\'s Dream-Seeking Tracks': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: PenaconyCommonValidSub,
            shouldLock: PenaconyCommonShouldLock
        }
    },
    'Belobog\'s Fortress of Preservation': {
        [RelicType.DEFPercentage]: {
            validSub: BelobogCommonValidSub,
            shouldLock: BelobogCommonShouldLock
        }
    },
    'Belobog\'s Iron Defense': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: BelobogCommonValidSub,
            shouldLock: BelobogCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: BelobogCommonValidSub,
            shouldLock: BelobogCommonShouldLock
        }
    },
    'Talia\'s Nailscrap Town': {
        [RelicType.DEFPercentage]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        }
    },
    'Talia\'s Exposed Electric Wire': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
        }
    },
    'Salsotto\'s Moving City': {
        [RelicType.DEFPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        }
    },
    'Salsotto\'s Terminator Line': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: SalsottoCommonValidSub,
            shouldLock: SalsottoCommonShouldLock
        },
    },
    'Taikiyan Laser Stadium': {
        [RelicType.DEFPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        }
    },
    'Taikiyan\'s Arclight Race Track': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: TaikiyanCommonValidSub,
            shouldLock: TaikiyanCommonShouldLock
        },
    },
    'Sigonia\'s Gaiathra Berth': {
        [RelicType.DEFPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        }
    },
    'Sigonia\'s Knot of Cyclicality': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: SigoniaCommonValidSub,
            shouldLock: SigoniaCommonShouldLock
        },
    },
    'Thief\'s Myriad-Faced Mask': {
        [RelicType.HP]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Gloves With Prints': {
        [RelicType.ATK]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Steel Grappling Hook': {
        [RelicType.CRITRate]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Thief\'s Meteor Boots': {
        [RelicType.SPD]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: ThiefCommonValidSub,
            shouldLock: ThiefCommonShouldLock
        }
    },
    'Watchmaker\'s Telescoping Lens': {
        [RelicType.HP]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Fortuitous Wristwatch': {
        [RelicType.ATK]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Illusory Formal Suit': {
        [RelicType.CRITRate]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Watchmaker\'s Dream-Concealing Dress Shoes': {
        [RelicType.SPD]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: WatchmakerCommonValidSub,
            shouldLock: WatchmakerCommonShouldLock
        }
    },
    'Passerby\'s Rejuvenated Wooden Hairstick': {
        [RelicType.HP]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Roaming Dragon Bracer': {
        [RelicType.ATK]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Ragged Embroided Coat': {
        [RelicType.OutgoingHealingBoost]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Passerby\'s Stygian Hiking Boots': {
        [RelicType.SPD]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: PasserbyCommonValidSub,
            shouldLock: PasserbyCommonShouldLock
        }
    },
    'Knight\'s Forgiving Casque': {
        [RelicType.HP]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Silent Oath Ring': {
        [RelicType.ATK]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Solemn Breastplate': {
        [RelicType.HPPercentage]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Knight\'s Iron Boots of Order': {
        [RelicType.SPD]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: KnightCommonValidSub,
            shouldLock: KnightCommonShouldLock
        }
    },
    'Guard\'s Cast Iron Helmet': {
        [RelicType.HP]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Shining Gauntlets': {
        [RelicType.ATK]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Uniform of Old': {
        [RelicType.HPPercentage]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Guard\'s Silver Greaves': {
        [RelicType.SPD]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: GuardCommonValidSub,
            shouldLock: GuardCommonShouldLock
        }
    },
    'Messenger\'s Holovisor': {
        [RelicType.HP]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Transformative Arm': {
        [RelicType.ATK]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Secret Satchel': {
        [RelicType.HPPercentage]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.EffectHitRate]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.CRITRate]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.CRITDMG]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        },
        [RelicType.OutgoingHealingBoost]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Messenger\'s Par-kool Sneakers': {
        [RelicType.SPD]: {
            validSub: MessengerCommonValidSub,
            shouldLock: MessengerCommonShouldLock
        }
    },
    'Insumousu\'s Whalefall Ship': {
        [RelicType.ATKPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.PhysicalDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.FireDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.IceDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.LightningDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.WindDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.QuantumDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.ImaginaryDMGBoost]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        }
    },
    'Insumousu\'s Frayed Hawser': {
        [RelicType.EnergyRegenerationRate]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.BreakEffect]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.DEFPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.ATKPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
        [RelicType.HPPercentage]: {
            validSub: InsumousuCommonValidSub,
            shouldLock: InsumousuCommonShouldLock
        },
    }

}

export default {
    relicMainStatsLevel,
    relicSubStatsScore,
    relicRating
}
