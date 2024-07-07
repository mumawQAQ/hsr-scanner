export type CharacterBasePartRating = {
  character: string[];
  valuableSub: {
    [subStat: string]: {
      valuable: boolean;
    };
  };
  minTotalScore: number;
  maxTotalScore: number;
  totalScore: number;
};

// This is the new rating rule format
export type ValuableSubStatsV2 = {
  subStat: string;
  ratingScale: number;
};

export type RatingRule = {
  setNames: string[];
  partNames: {
    [partName: string]: {
      valuableMain: string[];
      partType: string;
    };
  };

  // compatible with old rating rule format
  valuableSub: Array<string | ValuableSubStatsV2>;
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
