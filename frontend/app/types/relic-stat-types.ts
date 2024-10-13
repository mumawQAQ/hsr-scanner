export type RelicMainStatsType = 'head' | 'hand' | 'body' | 'feet' | 'sphere' | 'rope';

export const RelicHeadMainStatsType: {
  [key: string]: string;
} = {
  HP: '生命',
};

export const RelicHandMainStatsType: {
  [key: string]: string;
} = {
  ATK: '攻击',
};

export const RelicBodyMainStatsType: {
  [key: string]: string;
} = {
  HPPercentage: '生命百分比',
  ATKPercentage: '攻击百分比',
  DEFPercentage: '防御百分比',
  CRITRate: '暴击率',
  CRITDMG: '暴击伤害',
  OutgoingHealingBoost: '治疗量加成',
  EffectHitRate: '效果命中',
};

export const RelicFeetMainStatsType: {
  [key: string]: string;
} = {
  SPD: '速度',
  HPPercentage: '生命百分比',
  ATKPercentage: '攻击百分比',
  DEFPercentage: '防御百分比',
};

export const RelicRopeMainStatsType: {
  [key: string]: string;
} = {
  HPPercentage: '生命百分比',
  ATKPercentage: '攻击百分比',
  DEFPercentage: '防御百分比',
  BreakEffect: '击破特攻',
  EnergyRegenerationRate: '能量回复效率',
};

export const RelicSphereMainStatsType: {
  [key: string]: string;
} = {
  HPPercentage: '生命百分比',
  ATKPercentage: '攻击百分比',
  DEFPercentage: '防御百分比',
  PhysicalDMGBoost: '物理属性伤害提高',
  FireDMGBoost: '火属性伤害提高',
  IceDMGBoost: '冰属性伤害提高',
  LightningDMGBoost: '雷属性伤害提高',
  WindDMGBoost: '风属性伤害提高',
  QuantumDMGBoost: '量子属性伤害提高',
  ImaginaryDMGBoost: '虚数属性伤害提高',
};

export const RelicSubStatsType: {
  [key: string]: string;
} = {
  HP: '生命',
  HPPercentage: '生命百分比',
  ATK: '攻击',
  ATKPercentage: '攻击百分比',
  DEF: '防御',
  DEFPercentage: '防御百分比',
  SPD: '速度',
  CRITRate: '暴击率',
  CRITDMG: '暴击伤害',
  BreakEffect: '击破特攻',
  EffectHitRate: '效果命中',
  EffectRES: '效果抵抗',
};
