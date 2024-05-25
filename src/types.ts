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
    DEF = 'DEF',
    HP = 'HP',
    HPPercentage = 'HP Percentage',
    ATK = 'ATK',
    ATKPercentage = 'ATK Percentage',
    DEFPercentage = 'DEF Percentage',
    SPD = 'SPD',
    CRITRate = 'CRIT Rate',
    CRITDMG = 'CRIT DMG',
    BreakEffect = 'Break Effect',
    EffectHitRate = 'Effect Hit Rate',
    EffectRes = 'Effect Res',
    OutgoingHealingBoost = 'Outgoing Healing Boost',
    EnergyRegenerationRate = 'Energy Regeneration Rate',
    PhysicalDMGBoost = 'Physical DMG Boost',
    FireDMGBoost = 'Fire DMG Boost',
    IceDMGBoost = 'Ice DMG Boost',
    LightningDMGBoost = 'Lightning DMG Boost',
    WindDMGBoost = 'Wind DMG Boost',
    QuantumDMGBoost = 'Quantum DMG Boost',
    ImaginaryDMGBoost = 'Imaginary DMG Boost',
}
