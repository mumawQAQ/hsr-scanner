import {RelicType} from "@/types.ts";

const commonStatsRegs = [
    {
        name: RelicType.HP,
        reg: /HP\s+\d+\r?\n/gi
    },
    {
        name: RelicType.HPPercentage,
        reg: /HP\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.ATK,
        reg: /ATK\s+\d+\r?\n/gi
    },
    {
        name: RelicType.ATKPercentage,
        reg: /ATK\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.DEF,
        reg: /DEF\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.SPD,
        reg: /SPD\s+\d+\r?\n/gi
    },
    {
        name: RelicType.CRITRate,
        reg: /CRIT Rate\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.CRITDMG,
        reg: /CRIT DMG\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.BreakEffect,
        reg: /Break Effect\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.EffectHitRate,
        reg: /Effect Hit Rate\s+\d+(\.\d+)?%\r?\n/gi
    }
]


const mainStatsRegs = [
    ...commonStatsRegs,
    {
        name: RelicType.OutgoingHealingBoost,
        reg: /Outgoing Healing Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.EnergyRegenerationRate,
        reg: /Energy Regeneration Rate\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.PhysicalDMGBoost,
        reg: /Physical DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.FireDMGBoost,
        reg: /Fire DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.IceDMGBoost,
        reg: /Ice DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.LightningDMGBoost,
        reg: /Lightning DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.WindDMGBoost,
        reg: /Wind DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.QuantumDMGBoost,
        reg: /Quantum DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: RelicType.ImaginaryDMGBoost,
        reg: /Imaginary DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    }
]

const subStatsRegs = [
    ...commonStatsRegs,
    {
        name: RelicType.DEF,
        reg: /DEF\s+\d+\r?\n/gi
    },
    {
        name: RelicType.EffectRes,
        reg: /Effect Res\s+\d+(\.\d+)?%\r?\n/gi
    }
]

export default {
    mainStatsRegs,
    subStatsRegs
}
