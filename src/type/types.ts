import char1 from '../assets/icon/character/img.png';
import char2 from '../assets/icon/character/img_1.png';
import char11 from '../assets/icon/character/img_10.png';
import char12 from '../assets/icon/character/img_11.png';
import char13 from '../assets/icon/character/img_12.png';
import char14 from '../assets/icon/character/img_13.png';
import char15 from '../assets/icon/character/img_14.png';
import char16 from '../assets/icon/character/img_15.png';
import char17 from '../assets/icon/character/img_16.png';
import char18 from '../assets/icon/character/img_17.png';
import char19 from '../assets/icon/character/img_18.png';
import char20 from '../assets/icon/character/img_19.png';
import char3 from '../assets/icon/character/img_2.png';
import char21 from '../assets/icon/character/img_20.png';
import char22 from '../assets/icon/character/img_21.png';
import char23 from '../assets/icon/character/img_22.png';
import char24 from '../assets/icon/character/img_23.png';
import char25 from '../assets/icon/character/img_24.png';
import char26 from '../assets/icon/character/img_25.png';
import char27 from '../assets/icon/character/img_26.png';
import char28 from '../assets/icon/character/img_27.png';
import char29 from '../assets/icon/character/img_28.png';
import char30 from '../assets/icon/character/img_29.png';
import char4 from '../assets/icon/character/img_3.png';
import char31 from '../assets/icon/character/img_30.png';
import char32 from '../assets/icon/character/img_31.png';
import char33 from '../assets/icon/character/img_32.png';
import char34 from '../assets/icon/character/img_33.png';
import char35 from '../assets/icon/character/img_34.png';
import char36 from '../assets/icon/character/img_35.png';
import char37 from '../assets/icon/character/img_36.png';
import char38 from '../assets/icon/character/img_37.png';
import char39 from '../assets/icon/character/img_38.png';
import char40 from '../assets/icon/character/img_39.png';
import char5 from '../assets/icon/character/img_4.png';
import char41 from '../assets/icon/character/img_40.png';
import char42 from '../assets/icon/character/img_41.png';
import char43 from '../assets/icon/character/img_42.png';
import char44 from '../assets/icon/character/img_43.png';
import char45 from '../assets/icon/character/img_44.png';
import char46 from '../assets/icon/character/img_45.png';
import char47 from '../assets/icon/character/img_46.png';
import char48 from '../assets/icon/character/img_47.png';
import char49 from '../assets/icon/character/img_48.png';
import char50 from '../assets/icon/character/img_49.png';
import char6 from '../assets/icon/character/img_5.png';
import char51 from '../assets/icon/character/img_50.png';
import char52 from '../assets/icon/character/img_51.png';
import char7 from '../assets/icon/character/img_6.png';
import char8 from '../assets/icon/character/img_7.png';
import char9 from '../assets/icon/character/img_8.png';
import char10 from '../assets/icon/character/img_9.png';

export type RatingRule = {
  setNames: string[];
  partNames: {
    [partName: string]: {
      valuableMain: string[];
      partType: string;
    };
  };
  valuableSub: string[];
  fitCharacters: string[];
};

export type RatingTemplate = {
  templateName: string;
  templateDescription: string;
  author: string;
  rules: {
    [ruleID: string]: RatingRule;
  };
};

export type RatingTemplateStore = {
  [key: string]: RatingTemplate;
};

export type RelicSubStats = {
  name: RelicType;
  number: string;
  score: [number] | number;
};

export type RelicMainStats = {
  name: RelicType;
  number: string;
  level: number;
};

export type OCRResult = {
  title: OCRTitleResult;
  mainStats: OCRMainStatsResult;
  subStats: OCRSubStatsResult;
};

export type OCRTitleResult = {
  result: string | null;
  error: string | null;
};

export type OCRMainStatsResult = {
  result: RelicMainStats | null;
  error: string | null;
};

export type OCRSubStatsResult = {
  result: RelicSubStats[] | null;
  error: string | null;
};

export enum RelicHeadMainStatsType {
  HP = '生命',
}

export enum RelicGloveMainStatsType {
  ATK = '攻击',
}

export enum RelicBodyMainStatsType {
  HPPercentage = '生命百分比',
  ATKPercentage = '攻击百分比',
  DEFPercentage = '防御百分比',
  CRITRate = '暴击率',
  CRITDMG = '暴击伤害',
  OutgoingHealingBoost = '治疗量加成',
  EffectHitRate = '效果命中',
}

export enum RelicShoeMainStatsType {
  SPD = '速度',
  HPPercentage = '生命百分比',
  ATKPercentage = '攻击百分比',
  DEFPercentage = '防御百分比',
}

export enum RelicRopeMainStatsType {
  HPPercentage = '生命百分比',
  ATKPercentage = '攻击百分比',
  DEFPercentage = '防御百分比',
  BreakEffect = '击破特攻',
  EnergyRegenerationRate = '能量回复效率',
}

export enum RelicSphereMainStatsType {
  HPPercentage = '生命百分比',
  ATKPercentage = '攻击百分比',
  DEFPercentage = '防御百分比',
  PhysicalDMGBoost = '物理属性伤害提高',
  FireDMGBoost = '火属性伤害提高',
  IceDMGBoost = '冰属性伤害提高',
  LightningDMGBoost = '雷属性伤害提高',
  WindDMGBoost = '风属性伤害提高',
  QuantumDMGBoost = '量子属性伤害提高',
  ImaginaryDMGBoost = '虚数属性伤害提高',
}

export enum RelicSubStatsType {
  HP = '生命',
  HPPercentage = '生命百分比',
  ATK = '攻击',
  ATKPercentage = '攻击百分比',
  DEF = '防御',
  DEFPercentage = '防御百分比',
  SPD = '速度',
  CRITRate = '暴击率',
  CRITDMG = '暴击伤害',
  BreakEffect = '击破特攻',
  EffectHitRate = '效果命中',
  EffectRes = '效果抵抗',
}

export enum RelicType {
  DEF = '防御',
  HP = '生命',
  HPPercentage = '生命百分比',
  ATK = '攻击',
  ATKPercentage = '攻击百分比',
  DEFPercentage = '防御百分比',
  SPD = '速度',
  CRITRate = '暴击率',
  CRITDMG = '暴击伤害',
  BreakEffect = '击破特攻',
  EffectHitRate = '效果命中',
  EffectRes = '效果抵抗',
  OutgoingHealingBoost = '治疗量加成',
  EnergyRegenerationRate = '能量回复效率',
  PhysicalDMGBoost = '物理属性伤害提高',
  FireDMGBoost = '火属性伤害提高',
  IceDMGBoost = '冰属性伤害提高',
  LightningDMGBoost = '雷属性伤害提高',
  WindDMGBoost = '风属性伤害提高',
  QuantumDMGBoost = '量子属性伤害提高',
  ImaginaryDMGBoost = '虚数属性伤害提高',
}

export const AllSubStats: string[] = [
  RelicType.HP,
  RelicType.HPPercentage,
  RelicType.ATK,
  RelicType.ATKPercentage,
  RelicType.DEF,
  RelicType.DEFPercentage,
  RelicType.SPD,
  RelicType.CRITRate,
  RelicType.CRITDMG,
  RelicType.BreakEffect,
  RelicType.EffectHitRate,
  RelicType.EffectRes,
];

export const Characters: {
  [key: string]: {
    name: string;
    icon: string;
  };
} = {
  'Fu Xuan': {
    name: '符玄',
    icon: char1,
  },
  Acheron: {
    name: '黄泉',
    icon: char2,
  },
  Argenti: {
    name: '银枝',
    icon: char3,
  },
  Arlan: {
    name: '阿兰',
    icon: char4,
  },
  Asta: {
    name: '艾丝妲',
    icon: char5,
  },
  Aventurine: {
    name: '砂金',
    icon: char6,
  },
  Bailu: {
    name: '白鹿',
    icon: char7,
  },
  'Black Swan': {
    name: '黑天鹅',
    icon: char8,
  },
  Blade: {
    name: '刃',
    icon: char9,
  },
  Boothill: {
    name: '波提欧',
    icon: char10,
  },
  Bronya: {
    name: '布洛妮娅',
    icon: char11,
  },
  Clara: {
    name: '克拉拉',
    icon: char12,
  },
  'Dan Heng': {
    name: '丹恒',
    icon: char13,
  },
  'Dan Heng Imbibitor Lunae': {
    name: '丹恒•饮月',
    icon: char14,
  },
  'Dr. Ratio': {
    name: '真理医生',
    icon: char15,
  },
  Firefly: {
    name: '流萤',
    icon: char16,
  },
  Gallagher: {
    name: '加拉赫',
    icon: char17,
  },
  Gepard: {
    name: '杰帕德',
    icon: char18,
  },
  Guinaifen: {
    name: '桂乃芬',
    icon: char19,
  },
  Hanya: {
    name: '寒鸦',
    icon: char20,
  },
  Herta: {
    name: '黑塔',
    icon: char21,
  },
  Himeko: {
    name: '姬子',
    icon: char22,
  },
  Hook: {
    name: '虎克',
    icon: char23,
  },
  Huohuo: {
    name: '藿藿',
    icon: char24,
  },
  'Jing Yuan': {
    name: '景元',
    icon: char25,
  },
  Jingliu: {
    name: '静流',
    icon: char26,
  },
  Kafka: {
    name: '卡芙卡',
    icon: char27,
  },
  Luka: {
    name: '卢卡',
    icon: char28,
  },
  Luocha: {
    name: '罗刹',
    icon: char29,
  },
  Lynx: {
    name: '玲可',
    icon: char30,
  },
  'March 7th': {
    name: '三月七',
    icon: char31,
  },
  Misha: {
    name: '米沙',
    icon: char32,
  },
  Natasha: {
    name: '娜塔莎',
    icon: char33,
  },
  Pela: {
    name: '佩拉',
    icon: char34,
  },
  Qingque: {
    name: '青雀',
    icon: char35,
  },
  Robin: {
    name: '知更鸟',
    icon: char36,
  },
  'Ruan Mei': {
    name: '阮•梅',
    icon: char37,
  },
  Sampo: {
    name: '桑博',
    icon: char38,
  },
  Seele: {
    name: '希儿',
    icon: char39,
  },
  Serval: {
    name: '希露瓦',
    icon: char40,
  },
  'Silver Wolf': {
    name: '银狼',
    icon: char41,
  },
  Sparkle: {
    name: '花火',
    icon: char42,
  },
  Sushang: {
    name: '素裳',
    icon: char43,
  },
  Tingyun: {
    name: '停云',
    icon: char44,
  },
  'Topaz and Numby': {
    name: '托帕&账账',
    icon: char45,
  },
  'Trailblazer: Destruction': {
    name: '开拓者•毁灭',
    icon: char46,
  },
  'Trailblazer: Preservation': {
    name: '开拓者•存护',
    icon: char47,
  },
  'Trailblazer: Harmony': {
    name: '开拓者•同谐',
    icon: char48,
  },
  Welt: {
    name: '瓦尔特',
    icon: char49,
  },
  Xueyi: {
    name: '雪衣',
    icon: char50,
  },
  Yanqing: {
    name: '彦卿',
    icon: char51,
  },
  Yukong: {
    name: '驭空',
    icon: char52,
  },
};
