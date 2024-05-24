const commonStatsRegs = [
    {
        name: 'HP',
        reg: /HP\s+\d+\r?\n/gi
    },
    {
        name: 'HP Percentage',
        reg: /HP\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'ATK',
        reg: /ATK\s+\d+\r?\n/gi
    },
    {
        name: 'ATK Percentage',
        reg: /ATK\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'DEF Percentage',
        reg: /DEF\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'SPD',
        reg: /SPD\s+\d+\r?\n/gi
    },
    {
        name: 'CRIT Rate',
        reg: /CRIT Rate\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'CRIT DMG',
        reg: /CRIT DMG\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Break Effect',
        reg: /Break Effect\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Effect Hit Rate',
        reg: /Effect Hit Rate\s+\d+(\.\d+)?%\r?\n/gi
    }
]


const mainStatsRegs = [
    ...commonStatsRegs,
    {
        name: 'Outgoing Healing Boost',
        reg: /Outgoing Healing Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Energy Regeneration Rate',
        reg: /Energy Regeneration Rate\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Physical DMG Boost',
        reg: /Physical DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Fire DMG Boost',
        reg: /Fire DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Ice DMG Boost',
        reg: /Ice DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Lightning DMG Boost',
        reg: /Lightning DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Wind DMG Boost',
        reg: /Wind DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Quantum DMG Boost',
        reg: /Quantum DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    },
    {
        name: 'Imaginary DMG Boost',
        reg: /Imaginary DMG Boost\s+\d+(\.\d+)?%\r?\n/gi
    }
]

const subStatsRegs = [
    ...commonStatsRegs,
    {
        name: 'DEF',
        reg: /DEF\s+\d+\r?\n/gi
    },
    {
        name: 'Effect Res',
        reg: /Effect Res\s+\d+(\.\d+)?%\r?\n/gi
    }
]

export default {
    mainStatsRegs,
    subStatsRegs
}
