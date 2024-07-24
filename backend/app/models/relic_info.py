from enum import Enum

from pydantic import BaseModel


class RelicType(Enum):
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


class RelicTitle(BaseModel):
    title: str


class RelicMainStat(BaseModel):
    name: RelicType
    number: float
    level: int
    enhance_level: int


class RelicSubStat(BaseModel):
    name: RelicType
    number: float
    level: int
    score: list[float]


class RelicInfo(BaseModel):
    title: RelicTitle
    main_stat: RelicMainStat
    sub_stats: list[RelicSubStat]
