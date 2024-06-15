export type RelicSubStats = {
    name: RelicType;
    number: string;
    score: [number] | number;
}


export type RelicMainStats = {
    name: RelicType;
    number: string;
    level: number;
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
