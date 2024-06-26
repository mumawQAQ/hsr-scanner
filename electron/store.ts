import ElectronStore from 'electron-store';

import { RelicRulesTemplateStore, RelicType } from '../types.ts';

interface StoreData {
  data: {
    relicMainStatsLevel: {
      [index: string]: {
        base: number;
        step: number;
      };
    };
    relicSubStatsScore: {
      [index: string]: { [index: string]: number | number[] };
    };
    relicRating: {
      [index: string]: {
        [index: string]: {
          valuableSub: string[];
          shouldLock: {
            contain: string;
            include: { [index: string]: string[] };
          };
        };
      };
    };
    relicRulesTemplates: RelicRulesTemplateStore;
  };
}

const relicMainStatsLevel = {
  [RelicType.HP]: {
    base: 112.896,
    step: 39.5136,
  },
  [RelicType.ATK]: {
    base: 56,
    step: 19.7568,
  },
  [RelicType.HPPercentage]: {
    base: 0.06912,
    step: 0.024192,
  },
  [RelicType.ATKPercentage]: {
    base: 0.06912,
    step: 0.024192,
  },
  [RelicType.DEFPercentage]: {
    base: 0.0864,
    step: 0.030240001,
  },
  [RelicType.SPD]: {
    base: 4.032,
    step: 1.4,
  },
  [RelicType.CRITRate]: {
    base: 0.05184,
    step: 0.018144,
  },
  [RelicType.CRITDMG]: {
    base: 0.10368,
    step: 0.036288,
  },
  [RelicType.BreakEffect]: {
    base: 0.10368,
    step: 0.036288,
  },
  [RelicType.OutgoingHealingBoost]: {
    base: 0.055296,
    step: 0.019354,
  },
  [RelicType.EnergyRegenerationRate]: {
    base: 0.031104,
    step: 0.010886001,
  },
  [RelicType.EffectHitRate]: {
    base: 0.06912,
    step: 0.024192,
  },
  [RelicType.PhysicalDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.FireDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.IceDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.LightningDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.WindDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.QuantumDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
  [RelicType.ImaginaryDMGBoost]: {
    base: 0.062208,
    step: 0.021773001,
  },
};

const relicSubStatsScore = {
  [RelicType.HP]: {
    '33': 0.8,
    '38': 0.9,
    '42': 1.0,
    '67': 1.6,
    '71': 1.7,
    '76': 1.8,
    '80': 1.9,
    '84': 2.0,
    '101': 2.4,
    '105': 2.5,
    '110': 2.6,
    '114': 2.7,
    '118': 2.8,
    '122': 2.9,
    '127': 3.0,
    '135': 3.2,
    '139': 3.3,
    '143': 3.4,
    '148': 3.5,
    '152': 3.6,
    '156': 3.7,
    '160': 3.8,
    '165': 3.9,
    '169': 4.0,
    '173': 4.1,
    '177': 4.2,
    '182': 4.3,
    '186': 4.4,
    '190': 4.5,
    '194': 4.6,
    '198': 4.7,
    '203': 4.8,
    '207': 4.9,
    '211': 5.0,
    '215': 5.1,
    '220': 5.2,
    '224': 5.3,
    '228': 5.4,
    '232': 5.5,
    '237': 5.6,
    '241': 5.7,
    '245': 5.8,
    '249': 5.9,
    '254': 6.0,
  },
  [RelicType.ATK]: {
    '16': 0.8,
    '19': 0.9,
    '21': 1.0,
    '33': 1.6,
    '35': 1.7,
    '38': 1.8,
    '40': 1.9,
    '42': 2.0,
    '50': 2.4,
    '52': 2.5,
    '55': 2.6,
    '57': 2.7,
    '59': 2.8,
    '61': 2.9,
    '63': 3.0,
    '67': 3.2,
    '69': 3.3,
    '71': 3.4,
    '74': 3.5,
    '76': 3.6,
    '78': 3.7,
    '80': 3.8,
    '82': 3.9,
    '84': 4.0,
    '86': 4.1,
    '88': 4.2,
    '91': 4.3,
    '93': 4.4,
    '95': 4.5,
    '97': 4.6,
    '99': 4.7,
    '101': 4.8,
    '103': 4.9,
    '105': 5.0,
    '107': 5.1,
    '110': 5.2,
    '112': 5.3,
    '114': 5.4,
    '116': 5.5,
    '118': 5.6,
    '120': 5.7,
    '122': 5.8,
    '124': 5.9,
    '127': 6.0,
  },
  [RelicType.DEF]: {
    '16': 0.8,
    '19': 0.9,
    '21': 1.0,
    '33': 1.6,
    '35': 1.7,
    '38': 1.8,
    '40': 1.9,
    '42': 2.0,
    '50': 2.4,
    '52': 2.5,
    '55': 2.6,
    '57': 2.7,
    '59': 2.8,
    '61': 2.9,
    '63': 3.0,
    '67': 3.2,
    '69': 3.3,
    '71': 3.4,
    '74': 3.5,
    '76': 3.6,
    '78': 3.7,
    '80': 3.8,
    '82': 3.9,
    '84': 4.0,
    '86': 4.1,
    '88': 4.2,
    '91': 4.3,
    '93': 4.4,
    '95': 4.5,
    '97': 4.6,
    '99': 4.7,
    '101': 4.8,
    '103': 4.9,
    '105': 5.0,
    '107': 5.1,
    '110': 5.2,
    '112': 5.3,
    '114': 5.4,
    '116': 5.5,
    '118': 5.6,
    '120': 5.7,
    '122': 5.8,
    '124': 5.9,
    '127': 6.0,
  },
  [RelicType.HPPercentage]: {
    '3.4%': 0.8,
    '3.8%': 0.9,
    '4.3%': 1.0,
    '6.9%': 1.6,
    '7.3%': 1.7,
    '7.7%': 1.8,
    '8.2%': 1.9,
    '8.6%': 2.0,
    '10.3%': 2.4,
    '10.8%': 2.5,
    '11.2%': 2.6,
    '11.6%': 2.7,
    '12.0%': 2.8,
    '12.5%': 2.9,
    '12.9%': 3.0,
    '13.8%': 3.2,
    '14.2%': 3.3,
    '14.6%': 3.4,
    '15.1%': 3.5,
    '15.5%': 3.6,
    '15.9%': 3.7,
    '16.4%': 3.8,
    '16.8%': 3.9,
    '17.2%': 4.0,
    '17.7%': 4.1,
    '18.1%': 4.2,
    '18.5%': 4.3,
    '19.0%': 4.4,
    '19.4%': 4.5,
    '19.8%': 4.6,
    '20.3%': 4.7,
    '20.7%': 4.8,
    '21.1%': 4.9,
    '21.6%': 5.0,
    '22.0%': 5.1,
    '22.4%': 5.2,
    '22.8%': 5.3,
    '23.3%': 5.4,
    '23.7%': 5.5,
    '24.1%': 5.6,
    '24.6%': 5.7,
    '25.0%': 5.8,
    '25.4%': 5.9,
    '25.9%': 6.0,
  },
  [RelicType.ATKPercentage]: {
    '3.4%': 0.8,
    '3.8%': 0.9,
    '4.3%': 1.0,
    '6.9%': 1.6,
    '7.3%': 1.7,
    '7.7%': 1.8,
    '8.2%': 1.9,
    '8.6%': 2.0,
    '10.3%': 2.4,
    '10.8%': 2.5,
    '11.2%': 2.6,
    '11.6%': 2.7,
    '12.0%': 2.8,
    '12.5%': 2.9,
    '12.9%': 3.0,
    '13.8%': 3.2,
    '14.2%': 3.3,
    '14.6%': 3.4,
    '15.1%': 3.5,
    '15.5%': 3.6,
    '15.9%': 3.7,
    '16.4%': 3.8,
    '16.8%': 3.9,
    '17.2%': 4.0,
    '17.7%': 4.1,
    '18.1%': 4.2,
    '18.5%': 4.3,
    '19.0%': 4.4,
    '19.4%': 4.5,
    '19.8%': 4.6,
    '20.3%': 4.7,
    '20.7%': 4.8,
    '21.1%': 4.9,
    '21.6%': 5.0,
    '22.0%': 5.1,
    '22.4%': 5.2,
    '22.8%': 5.3,
    '23.3%': 5.4,
    '23.7%': 5.5,
    '24.1%': 5.6,
    '24.6%': 5.7,
    '25.0%': 5.8,
    '25.4%': 5.9,
    '25.9%': 6.0,
  },
  [RelicType.DEFPercentage]: {
    '4.3%': 0.8,
    '4.8%': 0.9,
    '5.4%': 1.0,
    '8.6%': 1.6,
    '9.1%': 1.7,
    '9.7%': 1.8,
    '10.2%': 1.9,
    '10.8%': 2.0,
    '12.9%': 2.4,
    '13.5%': 2.5,
    '14.0%': 2.6,
    '14.5%': 2.7,
    '15.1%': 2.8,
    '15.6%': 2.9,
    '16.2%': 3.0,
    '17.2%': 3.2,
    '17.8%': 3.3,
    '18.3%': 3.4,
    '18.9%': 3.5,
    '19.4%': 3.6,
    '19.9%': 3.7,
    '20.5%': 3.8,
    '21.0%': 3.9,
    '21.6%': 4.0,
    '22.1%': 4.1,
    '22.6%': 4.2,
    '23.2%': 4.3,
    '23.7%': 4.4,
    '24.3%': 4.5,
    '24.8%': 4.6,
    '25.3%': 4.7,
    '25.9%': 4.8,
    '26.4%': 4.9,
    '27.0%': 5.0,
    '27.5%': 5.1,
    '28.0%': 5.2,
    '28.6%': 5.3,
    '29.1%': 5.4,
    '29.7%': 5.5,
    '30.2%': 5.6,
    '30.7%': 5.7,
    '31.3%': 5.8,
    '31.8%': 5.9,
    '32.4%': 6.0,
  },
  [RelicType.SPD]: {
    '2': [0.8, 0.9, 1.0],
    '4': [1.6, 1.7, 1.8, 1.9],
    '5': 2.0,
    '6': [2.4, 2.5, 2.6, 2.7],
    '7': [2.8, 2.9, 3.0],
    '8': [3.2, 3.3, 3.4, 3.5],
    '9': [3.6, 3.7, 3.8],
    '10': [3.9, 4.0, 4.1, 4.2, 4.3],
    '11': [4.4, 4.5, 4.6],
    '12': [4.7, 4.8, 4.9, 5.0, 5.1],
    '13': [5.0, 5.2, 5.3, 5.4],
    '14': [5.5, 5.6, 5.7, 5.8, 5.9],
    '15': [5.8, 5.9, 6.0],
  },
  [RelicType.CRITRate]: {
    '2.5%': 0.8,
    '2.9%': 0.9,
    '3.2%': 1.0,
    '5.1%': 1.6,
    '5.5%': 1.7,
    '5.8%': 1.8,
    '6.1%': 1.9,
    '6.4%': 2.0,
    '7.7%': 2.4,
    '8.1%': 2.5,
    '8.4%': 2.6,
    '8.7%': 2.7,
    '9.0%': 2.8,
    '9.3%': 2.9,
    '9.7%': 3.0,
    '10.3%': 3.2,
    '10.6%': 3.3,
    '11.0%': 3.4,
    '11.3%': 3.5,
    '11.6%': 3.6,
    '11.9%': 3.7,
    '12.3%': 3.8,
    '12.6%': 3.9,
    '12.9%': 4.0,
    '13.2%': 4.1,
    '13.6%': 4.2,
    '13.9%': 4.3,
    '14.2%': 4.4,
    '14.5%': 4.5,
    '14.9%': 4.6,
    '15.2%': 4.7,
    '15.5%': 4.8,
    '15.8%': 4.9,
    '16.2%': 5.0,
    '16.5%': 5.1,
    '16.8%': 5.2,
    '17.1%': 5.3,
    '17.4%': 5.4,
    '17.8%': 5.5,
    '18.1%': 5.6,
    '18.4%': 5.7,
    '18.7%': 5.8,
    '19.1%': 5.9,
    '19.4%': 6.0,
  },
  [RelicType.CRITDMG]: {
    '5.1%': 0.8,
    '5.8%': 0.9,
    '6.4%': 1.0,
    '10.3%': 1.6,
    '11.0%': 1.7,
    '11.6%': 1.8,
    '12.3%': 1.9,
    '12.9%': 2.0,
    '15.5%': 2.4,
    '16.2%': 2.5,
    '16.8%': 2.6,
    '17.4%': 2.7,
    '18.1%': 2.8,
    '18.7%': 2.9,
    '19.4%': 3.0,
    '20.7%': 3.2,
    '21.3%': 3.3,
    '22.0%': 3.4,
    '22.6%': 3.5,
    '23.3%': 3.6,
    '23.9%': 3.7,
    '24.6%': 3.8,
    '25.2%': 3.9,
    '25.9%': 4.0,
    '26.5%': 4.1,
    '27.2%': 4.2,
    '27.8%': 4.3,
    '28.5%': 4.4,
    '29.1%': 4.5,
    '29.8%': 4.6,
    '30.4%': 4.7,
    '31.1%': 4.8,
    '31.7%': 4.9,
    '32.4%': 5.0,
    '33.0%': 5.1,
    '33.6%': 5.2,
    '34.3%': 5.3,
    '34.9%': 5.4,
    '35.6%': 5.5,
    '36.2%': 5.6,
    '36.9%': 5.7,
    '37.5%': 5.8,
    '38.2%': 5.9,
    '38.8%': 6.0,
  },
  [RelicType.EffectHitRate]: {
    '3.4%': 0.8,
    '3.8%': 0.9,
    '4.3%': 1.0,
    '6.9%': 1.6,
    '7.3%': 1.7,
    '7.7%': 1.8,
    '8.2%': 1.9,
    '8.6%': 2.0,
    '10.3%': 2.4,
    '10.8%': 2.5,
    '11.2%': 2.6,
    '11.6%': 2.7,
    '12.0%': 2.8,
    '12.5%': 2.9,
    '12.9%': 3.0,
    '13.8%': 3.2,
    '14.2%': 3.3,
    '14.6%': 3.4,
    '15.1%': 3.5,
    '15.5%': 3.6,
    '15.9%': 3.7,
    '16.4%': 3.8,
    '16.8%': 3.9,
    '17.2%': 4.0,
    '17.7%': 4.1,
    '18.1%': 4.2,
    '18.5%': 4.3,
    '19.0%': 4.4,
    '19.4%': 4.5,
    '19.8%': 4.6,
    '20.3%': 4.7,
    '20.7%': 4.8,
    '21.1%': 4.9,
    '21.6%': 5.0,
    '22.0%': 5.1,
    '22.4%': 5.2,
    '22.8%': 5.3,
    '23.3%': 5.4,
    '23.7%': 5.5,
    '24.1%': 5.6,
    '24.6%': 5.7,
    '25.0%': 5.8,
    '25.4%': 5.9,
    '25.9%': 6.0,
  },
  [RelicType.EffectRes]: {
    '3.4%': 0.8,
    '3.8%': 0.9,
    '4.3%': 1.0,
    '6.9%': 1.6,
    '7.3%': 1.7,
    '7.7%': 1.8,
    '8.2%': 1.9,
    '8.6%': 2.0,
    '10.3%': 2.4,
    '10.8%': 2.5,
    '11.2%': 2.6,
    '11.6%': 2.7,
    '12.0%': 2.8,
    '12.5%': 2.9,
    '12.9%': 3.0,
    '13.8%': 3.2,
    '14.2%': 3.3,
    '14.6%': 3.4,
    '15.1%': 3.5,
    '15.5%': 3.6,
    '15.9%': 3.7,
    '16.4%': 3.8,
    '16.8%': 3.9,
    '17.2%': 4.0,
    '17.7%': 4.1,
    '18.1%': 4.2,
    '18.5%': 4.3,
    '19.0%': 4.4,
    '19.4%': 4.5,
    '19.8%': 4.6,
    '20.3%': 4.7,
    '20.7%': 4.8,
    '21.1%': 4.9,
    '21.6%': 5.0,
    '22.0%': 5.1,
    '22.4%': 5.2,
    '22.8%': 5.3,
    '23.3%': 5.4,
    '23.7%': 5.5,
    '24.1%': 5.6,
    '24.6%': 5.7,
    '25.0%': 5.8,
    '25.4%': 5.9,
    '25.9%': 6.0,
  },
  [RelicType.BreakEffect]: {
    '5.1%': 0.8,
    '5.8%': 0.9,
    '6.4%': 1.0,
    '10.3%': 1.6,
    '11.0%': 1.7,
    '11.6%': 1.8,
    '12.3%': 1.9,
    '12.9%': 2.0,
    '15.5%': 2.4,
    '16.2%': 2.5,
    '16.8%': 2.6,
    '17.4%': 2.7,
    '18.1%': 2.8,
    '18.7%': 2.9,
    '19.4%': 3.0,
    '20.7%': 3.2,
    '21.3%': 3.3,
    '22.0%': 3.4,
    '22.6%': 3.5,
    '23.3%': 3.6,
    '23.9%': 3.7,
    '24.6%': 3.8,
    '25.2%': 3.9,
    '25.9%': 4.0,
    '26.5%': 4.1,
    '27.2%': 4.2,
    '27.8%': 4.3,
    '28.5%': 4.4,
    '29.1%': 4.5,
    '29.8%': 4.6,
    '30.4%': 4.7,
    '31.1%': 4.8,
    '31.7%': 4.9,
    '32.4%': 5.0,
    '33.0%': 5.1,
    '33.6%': 5.2,
    '34.3%': 5.3,
    '34.9%': 5.4,
    '35.6%': 5.5,
    '36.2%': 5.6,
    '36.9%': 5.7,
    '37.5%': 5.8,
    '38.2%': 5.9,
    '38.8%': 6.0,
  },
};

const MusketeerCommonValuableSub = [RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage];

const PrisonerCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.ATKPercentage,
  RelicType.SPD,
  RelicType.EffectHitRate,
];

const GlamothCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.SPD,
  RelicType.ATKPercentage,
  RelicType.EffectHitRate,
];

const lzumoCommonValuableSub = [RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.ATKPercentage];

const HertaCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.SPD,
  RelicType.ATKPercentage,
  RelicType.EffectHitRate,
];

const IPCCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.SPD,
  RelicType.ATKPercentage,
  RelicType.EffectHitRate,
];

const DiscipleCommonValuableSub = [RelicType.CRITRate, RelicType.CRITDMG, RelicType.SPD, RelicType.HPPercentage];

const GrandDukeCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.SPD,
  RelicType.ATKPercentage,
  RelicType.ATKPercentage,
  RelicType.DEFPercentage,
  RelicType.HPPercentage,
];

const ElementalCommonValuableSub = [
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.SPD,
  RelicType.ATKPercentage,
  RelicType.ATKPercentage,
  RelicType.DEFPercentage,
  RelicType.HPPercentage,
];

const XianZhouCommonValuableSub = [RelicType.SPD, RelicType.ATKPercentage];

const VonwacqCommonValuableSub = [RelicType.SPD, RelicType.ATKPercentage];

const PenaconyCommonValuableSub = [RelicType.SPD, RelicType.ATKPercentage];

const BelobogCommonValuableSub = [
  RelicType.SPD,
  RelicType.DEFPercentage,
  RelicType.EffectHitRate,
  RelicType.CRITRate,
  RelicType.CRITDMG,
];

const TaliaCommonValuableSub = [RelicType.SPD, RelicType.BreakEffect];

const SalsottoCommonValuableSub = [
  RelicType.SPD,
  RelicType.CRITDMG,
  RelicType.CRITRate,
  RelicType.ATKPercentage,
  RelicType.DEFPercentage,
  RelicType.HPPercentage,
];

const TaikiyanCommonValuableSub = [
  RelicType.SPD,
  RelicType.CRITDMG,
  RelicType.CRITRate,
  RelicType.ATKPercentage,
  RelicType.DEFPercentage,
  RelicType.HPPercentage,
];

const SigoniaCommonValuableSub = [
  RelicType.SPD,
  RelicType.CRITDMG,
  RelicType.CRITRate,
  RelicType.ATKPercentage,
  RelicType.DEFPercentage,
  RelicType.HPPercentage,
];

const ThiefCommonValuableSub = [RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage];

const WatchmakerCommonValuableSub = [RelicType.SPD, RelicType.BreakEffect, RelicType.ATKPercentage];

const PasserbyCommonValuableSub = [RelicType.SPD, RelicType.HPPercentage, RelicType.EffectRes, RelicType.ATKPercentage];

const KnightCommonValuableSub = [
  RelicType.SPD,
  RelicType.DEFPercentage,
  RelicType.EffectRes,
  RelicType.CRITDMG,
  RelicType.CRITRate,
];

const GuardCommonValuableSub = [
  RelicType.SPD,
  RelicType.DEFPercentage,
  RelicType.EffectRes,
  RelicType.EffectHitRate,
  RelicType.HPPercentage,
];

const MessengerCommonValuableSub = [RelicType.SPD, RelicType.CRITRate, RelicType.CRITDMG, RelicType.ATKPercentage];

const InsumousuCommonValuableSub = [RelicType.SPD, RelicType.EffectRes, RelicType.CRITDMG, RelicType.CRITRate];

const relicRating = {
  "Musketeer's Wild Wheat Felt Hat": {
    [RelicType.HP]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Musketeer's Coarse Leather Gloves": {
    [RelicType.ATK]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Musketeer's Wind-Hunting Shawl": {
    [RelicType.CRITRate]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.OutgoingHealingBoost]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Musketeer's Rivets Riding Boots": {
    [RelicType.SPD]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: MusketeerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Prisoner's Sealed Muzzle": {
    [RelicType.HP]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Prisoner's Leadstone Shackles": {
    [RelicType.ATK]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Prisoner's Repressive Straitjacket": {
    [RelicType.CRITRate]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Prisoner's Restrictive Fetters": {
    [RelicType.SPD]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: PrisonerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Glamoth's Iron Cavalry Regiment": {
    [RelicType.ATKPercentage]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Glamoth's Silent Tombstone": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: GlamothCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "lzumo's Magatsu no Morokami": {
    [RelicType.ATKPercentage]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "lzumo's Blades of Origin and End": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: lzumoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Herta's Space Station": {
    [RelicType.ATKPercentage]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Herta's Wandering Trek": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: HertaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "The IPC's Mega HQ": {
    [RelicType.ATKPercentage]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "The IPC's Trade Route": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: IPCCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Disciple's Prosthetic Eye": {
    [RelicType.HP]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Disciple's Ingenium Hand": {
    [RelicType.ATK]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Disciple's Dewy Feather Garb": {
    [RelicType.CRITRate]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Disciple's Celestial Silk Sandals": {
    [RelicType.SPD]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: DiscipleCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Grand Duke's Crown of Netherflame": {
    [RelicType.HP]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Grand Duke's Gloves of Fieryfur": {
    [RelicType.ATK]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Grand Duke's Robe of Grace": {
    [RelicType.CRITRate]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Grand Duke's Ceremonial Boots": {
    [RelicType.SPD]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: GrandDukeCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Pioneer's Heatproof Shell": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Pioneer's Lacuna Compass": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Pioneer's Sealed Lead Apron": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Pioneer's Starfaring Anchor": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Hunter's Artaius Hood": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Hunter's Lizard Gloves": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Hunter's Ice Dragon Cloak": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Hunter's Soft Elkskin Boots": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Champion's Headgear": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Champion's Heavy Gloves": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Champion's Chest Guard": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Champion's Fleetfoot Boots": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Firesmith's Obsidian Goggles": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Firesmith's Ring of Flame-Mastery": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Firesmith's Fireproof Apron": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Firesmith's Alloy Leg": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Genius's Ultraremote Sensing Visor": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Genius's Frequency Catcher": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Genius's Metafield Suit": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Genius's Gravity Walker": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Band's Polarized Sunglasses": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Band's Touring Bracelet": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Band's Leather Jacket With Studs": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Band's Ankle Boots With Rivets": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Eagle's Beaked Helmet": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Eagle's Soaring Ring": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Eagle's Winged Suit Harness": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Eagle's Quilted Puttees": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Wastelander's Breathing Mask": {
    [RelicType.HP]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Wastelander's Desert Terminal": {
    [RelicType.ATK]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Wastelander's Friar Robe": {
    [RelicType.CRITRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Wastelander's Powered Greaves": {
    [RelicType.SPD]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ElementalCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "The Xianzhou Luofu's Celestial Ark": {
    [RelicType.ATKPercentage]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "The Xianzhou Luofu's Ambrosial Arbor Vines": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: XianZhouCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Vonwacq's Island of Birth": {
    [RelicType.ATKPercentage]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Vonwacq's Islandic Coast": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: VonwacqCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Penacony's Grand Hotel": {
    [RelicType.ATKPercentage]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Penacony's Dream-Seeking Tracks": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: PenaconyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Belobog's Fortress of Preservation": {
    [RelicType.DEFPercentage]: {
      valuableSub: BelobogCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Belobog's Iron Defense": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: BelobogCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: BelobogCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Talia's Nailscrap Town": {
    [RelicType.DEFPercentage]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Talia's Exposed Electric Wire": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.BreakEffect]: {
      valuableSub: TaliaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Salsotto's Moving City": {
    [RelicType.DEFPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Salsotto's Terminator Line": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.BreakEffect]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: SalsottoCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  'Taikiyan Laser Stadium': {
    [RelicType.DEFPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Taikiyan's Arclight Race Track": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.BreakEffect]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: TaikiyanCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Sigonia's Gaiathra Berth": {
    [RelicType.DEFPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Sigonia's Knot of Cyclicality": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.BreakEffect]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: SigoniaCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Thief's Myriad-Faced Mask": {
    [RelicType.HP]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Thief's Gloves With Prints": {
    [RelicType.ATK]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Thief's Steel Grappling Hook": {
    [RelicType.CRITRate]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.OutgoingHealingBoost]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Thief's Meteor Boots": {
    [RelicType.SPD]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: ThiefCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Watchmaker's Telescoping Lens": {
    [RelicType.HP]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Watchmaker's Fortuitous Wristwatch": {
    [RelicType.ATK]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Watchmaker's Illusory Formal Suit": {
    [RelicType.CRITRate]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.OutgoingHealingBoost]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Watchmaker's Dream-Concealing Dress Shoes": {
    [RelicType.SPD]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: WatchmakerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Passerby's Rejuvenated Wooden Hairstick": {
    [RelicType.HP]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Passerby's Roaming Dragon Bracer": {
    [RelicType.ATK]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Passerby's Ragged Embroided Coat": {
    [RelicType.OutgoingHealingBoost]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Passerby's Stygian Hiking Boots": {
    [RelicType.SPD]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: PasserbyCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Knight's Forgiving Casque": {
    [RelicType.HP]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Knight's Silent Oath Ring": {
    [RelicType.ATK]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Knight's Solemn Breastplate": {
    [RelicType.HPPercentage]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Knight's Iron Boots of Order": {
    [RelicType.SPD]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: KnightCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Guard's Cast Iron Helmet": {
    [RelicType.HP]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Guard's Shining Gauntlets": {
    [RelicType.ATK]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Guard's Uniform of Old": {
    [RelicType.HPPercentage]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Guard's Silver Greaves": {
    [RelicType.SPD]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: GuardCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Messenger's Holovisor": {
    [RelicType.HP]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Messenger's Transformative Arm": {
    [RelicType.ATK]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Messenger's Secret Satchel": {
    [RelicType.HPPercentage]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.EffectHitRate]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITRate]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.CRITDMG]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.OutgoingHealingBoost]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Messenger's Par-kool Sneakers": {
    [RelicType.SPD]: {
      valuableSub: MessengerCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Insumousu's Whalefall Ship": {
    [RelicType.ATKPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.PhysicalDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.FireDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.IceDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.LightningDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.WindDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.QuantumDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ImaginaryDMGBoost]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Insumousu's Frayed Hawser": {
    [RelicType.EnergyRegenerationRate]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.BreakEffect]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.DEFPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.ATKPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
    [RelicType.HPPercentage]: {
      valuableSub: InsumousuCommonValuableSub,
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  'Valorous Mask of Northern Skies': {
    [RelicType.HP]: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  'Valorous Bracelet of Grappling Hooks': {
    [RelicType.ATK]: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  'Valorous Plate of Souring Flight': {},
  'Valorous Greaves of Pursuing Hunt': {},
  "Iron Cavalry's Homing Helm": {
    [RelicType.HP]: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Iron Cavalry's Crushing Wristguard": {
    [RelicType.ATK]: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  },
  "Iron Cavalry's Silvery Armor": {},
  "Iron Cavalry's Skywalk Greaves": {},
  "Forge's Lotus Lantern Wick": {},
  "Forge's Heavenly Flamewheel Silk": {},
  "Duran's Mechabeast Bridle": {},
  "Duran's Tent of Golden Sky": {},
};

const store = new ElectronStore<StoreData>({
  defaults: {
    data: {
      relicMainStatsLevel: relicMainStatsLevel,
      relicSubStatsScore: relicSubStatsScore,
      relicRating: relicRating,
      relicRulesTemplates: {},
    },
  },
});

export default store;
