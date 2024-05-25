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

const TaliaCommonValidSub = [
    RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage, RelicType.EffectHitRate
]

const TaliaCommonShouldLock = [
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
    'Talia\'s Nailscrap Town': {
        [RelicType.ATKPercentage]: {
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
        [RelicType.ATKPercentage]: {
            validSub: TaliaCommonValidSub,
            shouldLock: TaliaCommonShouldLock
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
    }

}

export default {
    relicMainStatsLevel,
    relicSubStatsScore,
    relicRating
}
