import FuzzySet from 'fuzzyset.js';

export type RelicRulesTemplate = {
  name: string;
  valuableSub?: string[];
  shouldLock?: {
    contain: string;
    include: {
      [key: string]: string[];
    };
  };
};

export type RelicRulesTemplateStore = {
  [key: string]: RelicRulesTemplate;
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

export type RelicRatingInfo = {
  valuableSub: string[];
  shouldLock: {
    contain: string;
    include: {
      [key: string]: string[];
    };
  };
};

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

export const FuzzyTitleSet = FuzzySet([
  "Musketeer's Wild Wheat Felt Hat",
  "Musketeer's Coarse Leather Gloves",
  "Musketeer's Wind-Hunting Shawl",
  "Musketeer's Rivets Riding Boots",
  "Prisoner's Sealed Muzzle",
  "Prisoner's Leadstone Shackles",
  "Prisoner's Repressive Straitjacket",
  "Prisoner's Restrictive Fetters",
  "Glamoth's Iron Cavalry Regiment",
  "Glamoth's Silent Tombstone",
  "lzumo's Magatsu no Morokami",
  "lzumo's Blades of Origin and End",
  "Herta's Space Station",
  "Herta's Wandering Trek",
  "The IPC's Mega HQ",
  "The IPC's Trade Route",
  "Disciple's Prosthetic Eye",
  "Disciple's Ingenium Hand",
  "Disciple's Dewy Feather Garb",
  "Disciple's Celestial Silk Sandals",
  "Grand Duke's Crown of Netherflame",
  "Grand Duke's Gloves of Fieryfur",
  "Grand Duke's Robe of Grace",
  "Grand Duke's Ceremonial Boots",
  "Pioneer's Heatproof Shell",
  "Pioneer's Lacuna Compass",
  "Pioneer's Sealed Lead Apron",
  "Pioneer's Starfaring Anchor",
  "Hunter's Artaius Hood",
  "Hunter's Lizard Gloves",
  "Hunter's Ice Dragon Cloak",
  "Hunter's Soft Elkskin Boots",
  "Champion's Headgear",
  "Champion's Heavy Gloves",
  "Champion's Chest Guard",
  "Champion's Fleetfoot Boots",
  "Firesmith's Obsidian Goggles",
  "Firesmith's Ring of Flame-Mastery",
  "Firesmith's Fireproof Apron",
  "Firesmith's Alloy Leg",
  "Genius's Ultraremote Sensing Visor",
  "Genius's Frequency Catcher",
  "Genius's Metafield Suit",
  "Genius's Gravity Walker",
  "Band's Polarized Sunglasses",
  "Band's Touring Bracelet",
  "Band's Leather Jacket With Studs",
  "Band's Ankle Boots With Rivets",
  "Eagle's Beaked Helmet",
  "Eagle's Soaring Ring",
  "Eagle's Winged Suit Harness",
  "Eagle's Quilted Puttees",
  "Wastelander's Breathing Mask",
  "Wastelander's Desert Terminal",
  "Wastelander's Friar Robe",
  "Wastelander's Powered Greaves",
  "The Xianzhou Luofu's Celestial Ark",
  "The Xianzhou Luofu's Ambrosial Arbor Vines",
  "Vonwacq's Island of Birth",
  "Vonwacq's Islandic Coast",
  "Penacony's Grand Hotel",
  "Penacony's Dream-Seeking Tracks",
  "Belobog's Fortress of Preservation",
  "Belobog's Iron Defense",
  "Talia's Nailscrap Town",
  "Talia's Exposed Electric Wire",
  "Salsotto's Moving City",
  "Salsotto's Terminator Line",
  "Taikiyan's Arclight Race Track",
  "Sigonia's Gaiathra Berth",
  "Sigonia's Knot of Cyclicality",
  "Thief's Myriad-Faced Mask",
  "Thief's Gloves With Prints",
  "Thief's Steel Grappling Hook",
  "Thief's Meteor Boots",
  "Watchmaker's Telescoping Lens",
  "Watchmaker's Fortuitous Wristwatch",
  "Watchmaker's Illusory Formal Suit",
  "Watchmaker's Dream-Concealing Dress Shoes",
  "Passerby's Rejuvenated Wooden Hairstick",
  "Passerby's Roaming Dragon Bracer",
  "Passerby's Ragged Embroided Coat",
  "Passerby's Stygian Hiking Boots",
  "Knight's Forgiving Casque",
  "Knight's Silent Oath Ring",
  "Knight's Solemn Breastplate",
  "Knight's Iron Boots of Order",
  "Guard's Cast Iron Helmet",
  "Guard's Shining Gauntlets",
  "Guard's Uniform of Old",
  "Guard's Silver Greaves",
  "Messenger's Holovisor",
  "Messenger's Transformative Arm",
  "Messenger's Secret Satchel",
  "Messenger's Par-kool Sneakers",
  "Insumousu's Whalefall Ship",
  "Insumousu's Frayed Hawser",
  "Iron Cavalry's Homing Helm",
  "Iron Cavalry's Crushing Wristguard",
  "Iron Cavalry's Silvery Armor",
  "Iron Cavalry's Skywalk Greaves",
  "Forge's Lotus Lantern Wick",
  "Forge's Heavenly Flamewheel Silk",
  "Duran's Mechabeast Bridle",
  "Duran's Tent of Golden Sky",
]);
