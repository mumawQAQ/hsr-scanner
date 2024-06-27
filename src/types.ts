import FuzzySet from 'fuzzyset.js';

import char1 from '../src/assets/icon/character/img.png';
import char2 from '../src/assets/icon/character/img_1.png';
import char11 from '../src/assets/icon/character/img_10.png';
import char12 from '../src/assets/icon/character/img_11.png';
import char13 from '../src/assets/icon/character/img_12.png';
import char14 from '../src/assets/icon/character/img_13.png';
import char15 from '../src/assets/icon/character/img_14.png';
import char16 from '../src/assets/icon/character/img_15.png';
import char17 from '../src/assets/icon/character/img_16.png';
import char18 from '../src/assets/icon/character/img_17.png';
import char19 from '../src/assets/icon/character/img_18.png';
import char20 from '../src/assets/icon/character/img_19.png';
import char3 from '../src/assets/icon/character/img_2.png';
import char21 from '../src/assets/icon/character/img_20.png';
import char22 from '../src/assets/icon/character/img_21.png';
import char23 from '../src/assets/icon/character/img_22.png';
import char24 from '../src/assets/icon/character/img_23.png';
import char25 from '../src/assets/icon/character/img_24.png';
import char26 from '../src/assets/icon/character/img_25.png';
import char27 from '../src/assets/icon/character/img_26.png';
import char28 from '../src/assets/icon/character/img_27.png';
import char29 from '../src/assets/icon/character/img_28.png';
import char30 from '../src/assets/icon/character/img_29.png';
import char4 from '../src/assets/icon/character/img_3.png';
import char31 from '../src/assets/icon/character/img_30.png';
import char32 from '../src/assets/icon/character/img_31.png';
import char33 from '../src/assets/icon/character/img_32.png';
import char34 from '../src/assets/icon/character/img_33.png';
import char35 from '../src/assets/icon/character/img_34.png';
import char36 from '../src/assets/icon/character/img_35.png';
import char37 from '../src/assets/icon/character/img_36.png';
import char38 from '../src/assets/icon/character/img_37.png';
import char39 from '../src/assets/icon/character/img_38.png';
import char40 from '../src/assets/icon/character/img_39.png';
import char5 from '../src/assets/icon/character/img_4.png';
import char41 from '../src/assets/icon/character/img_40.png';
import char42 from '../src/assets/icon/character/img_41.png';
import char43 from '../src/assets/icon/character/img_42.png';
import char44 from '../src/assets/icon/character/img_43.png';
import char45 from '../src/assets/icon/character/img_44.png';
import char46 from '../src/assets/icon/character/img_45.png';
import char47 from '../src/assets/icon/character/img_46.png';
import char48 from '../src/assets/icon/character/img_47.png';
import char49 from '../src/assets/icon/character/img_48.png';
import char50 from '../src/assets/icon/character/img_49.png';
import char6 from '../src/assets/icon/character/img_5.png';
import char51 from '../src/assets/icon/character/img_50.png';
import char52 from '../src/assets/icon/character/img_51.png';
import char7 from '../src/assets/icon/character/img_6.png';
import char8 from '../src/assets/icon/character/img_7.png';
import char9 from '../src/assets/icon/character/img_8.png';
import char10 from '../src/assets/icon/character/img_9.png';
import image1 from '../src/assets/icon/relic/1.png';
import image10 from '../src/assets/icon/relic/10.png';
import image11 from '../src/assets/icon/relic/11.png';
import image12 from '../src/assets/icon/relic/12.png';
import image13 from '../src/assets/icon/relic/13.png';
import image14 from '../src/assets/icon/relic/14.png';
import image15 from '../src/assets/icon/relic/15.png';
import image16 from '../src/assets/icon/relic/16.png';
import image17 from '../src/assets/icon/relic/17.png';
import image18 from '../src/assets/icon/relic/18.png';
import image19 from '../src/assets/icon/relic/19.png';
import image2 from '../src/assets/icon/relic/2.png';
import image20 from '../src/assets/icon/relic/20.png';
import image21 from '../src/assets/icon/relic/21.png';
import image22 from '../src/assets/icon/relic/22.png';
import image23 from '../src/assets/icon/relic/23.png';
import image24 from '../src/assets/icon/relic/24.png';
import image25 from '../src/assets/icon/relic/25.png';
import image26 from '../src/assets/icon/relic/26.png';
import image27 from '../src/assets/icon/relic/27.png';
import image28 from '../src/assets/icon/relic/28.png';
import image29 from '../src/assets/icon/relic/29.png';
import image3 from '../src/assets/icon/relic/3.png';
import image30 from '../src/assets/icon/relic/30.png';
import image31 from '../src/assets/icon/relic/31.png';
import image32 from '../src/assets/icon/relic/32.png';
import image33 from '../src/assets/icon/relic/33.png';
import image34 from '../src/assets/icon/relic/34.png';
import image35 from '../src/assets/icon/relic/35.png';
import image36 from '../src/assets/icon/relic/36.png';
import image4 from '../src/assets/icon/relic/4.png';
import image5 from '../src/assets/icon/relic/5.png';
import image6 from '../src/assets/icon/relic/6.png';
import image7 from '../src/assets/icon/relic/7.png';
import image8 from '../src/assets/icon/relic/8.png';
import image9 from '../src/assets/icon/relic/9.png';

export type RatingTemplate = {
  [ruleID: string]: {
    setNames: string[];
    partNames: {
      [partName: string]: {
        valuableMain:
          | RelicHeadMainStatsType[]
          | RelicGloveMainStatsType[]
          | RelicBodyMainStatsType[]
          | RelicShoeMainStatsType[]
          | RelicRopeMainStatsType[]
          | RelicSphereMainStatsType[];
      };
    };
    valuableSub: RelicSubStatsType[];
    fitCharacters: string[];
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

export type RelicRatingInfo = {
  valuableSub: string[];
  shouldLock: {
    contain: string;
    include: {
      [key: string]: string[];
    };
  };
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

export const RelicSets: {
  [key: string]: {
    name: string;
    icon: string;
    isInner?: boolean;
    parts: {
      [key: string]: string;
    };
  };
} = {
  'Iron Cavalry Against the Scourge': {
    name: '荡除蠹灾的铁骑',
    isInner: false,
    icon: image8,
    parts: {
      Head: "Iron Cavalry's Homing Helm",
      Hand: "Iron Cavalry's Crushing Wristguard",
      Body: "Iron Cavalry's Silvery Armor",
      Feet: "Iron Cavalry's Skywalk Greaves",
    },
  },
  'Band of Sizzling Thunder': {
    name: '激奏雷电的乐队',
    icon: image1,
    isInner: false,
    parts: {
      Head: "Band's Polarized Sunglasses",
      Hand: "Band's Touring Bracelet",
      Body: "Band's Leather Jacket With Studs",
      Feet: "Band's Ankle Boots With Rivets",
    },
  },
  'Champion of Streetwise Boxing': {
    name: '街头出身的拳王',
    icon: image2,
    isInner: false,
    parts: {
      Head: "Champion's Headgear",
      Hand: "Champion's Heavy Gloves",
      Body: "Champion's Chest Guard",
      Feet: "Champion's Fleetfoot Boots",
    },
  },
  'Eagle of Twilight Line': {
    name: '晨昏交界的翔鹰',
    icon: image3,
    isInner: false,
    parts: {
      Head: "Eagle's Beaked Helmet",
      Hand: "Eagle's Soaring Ring",
      Body: "Eagle's Winged Suit Harness",
      Feet: "Eagle's Quilted Puttees",
    },
  },
  'Firesmith of Lava-Forging': {
    name: '熔岩锻铸的火匠',
    icon: image4,
    isInner: false,
    parts: {
      Head: "Firesmith's Obsidian Goggles",
      Hand: "Firesmith's Ring of Flame-Mastery",
      Body: "Firesmith's Fireproof Apron",
      Feet: "Firesmith's Alloy Leg",
    },
  },
  'Genius of Brilliant Stars': {
    name: '繁星璀璨的天才',
    icon: image5,
    isInner: false,
    parts: {
      Head: "Genius's Ultraremote Sensing Visor",
      Hand: "Genius's Frequency Catcher",
      Body: "Genius's Metafield Suit",
      Feet: "Genius's Gravity Walker",
    },
  },
  'Guard of Wuthering Snow': {
    name: '戍卫风雪的铁卫',
    icon: image6,
    isInner: false,
    parts: {
      Head: "Guard's Cast Iron Helmet",
      Hand: "Guard's Shining Gauntlets",
      Body: "Guard's Uniform of Old",
      Feet: "Guard's Silver Greaves",
    },
  },
  'Hunter of Glacial Forest': {
    name: '密林卧雪的猎人',
    icon: image7,
    isInner: false,
    parts: {
      Head: "Hunter's Artaius Hood",
      Hand: "Hunter's Lizard Gloves",
      Body: "Hunter's Ice Dragon Cloak",
      Feet: "Hunter's Soft Elkskin Boots",
    },
  },
  'Knight of Purity Palace': {
    name: '净庭教宗的圣骑士',
    icon: image9,
    isInner: false,
    parts: {
      Head: "Knight's Forgiving Casque",
      Hand: "Knight's Silent Oath Ring",
      Body: "Knight's Solemn Breastplate",
      Feet: "Knight's Iron Boots of Order",
    },
  },
  'Longevous Disciple': {
    name: '宝命长存的莳者',
    icon: image10,
    isInner: false,
    parts: {
      Head: "Disciple's Prosthetic Eye",
      Hand: "Disciple's Ingenium Hand",
      Body: "Disciple's Dewy Feather Garb",
      Feet: "Disciple's Celestial Silk Sandals",
    },
  },
  'Messenger Traversing Hackerspace': {
    name: '骇域漫游的信使',
    icon: image11,
    isInner: false,
    parts: {
      Head: "Messenger's Holovisor",
      Hand: "Messenger's Transformative Arm",
      Body: "Messenger's Secret Satchel",
      Feet: "Messenger's Par-kool Sneakers",
    },
  },
  'Musketeer of Wild Wheat': {
    name: '野穗伴行的快枪手',
    icon: image12,
    isInner: false,
    parts: {
      Head: "Musketeer's Wild Wheat Felt Hat",
      Hand: "Musketeer's Coarse Leather Gloves",
      Body: "Musketeer's Wind-Hunting Shawl",
      Feet: "Musketeer's Rivets Riding Boots",
    },
  },
  'Passerby of Wandering Cloud': {
    name: '云无留迹的过客',
    icon: image13,
    isInner: false,
    parts: {
      Head: "Passerby's Rejuvenated Wooden Hairstick",
      Hand: "Passerby's Roaming Dragon Bracer",
      Body: "Passerby's Ragged Embroided Coat",
      Feet: "Passerby's Stygian Hiking Boots",
    },
  },
  'Pioneer Diver of Dead Waters': {
    name: '死水深潜的先驱',
    icon: image14,
    isInner: false,
    parts: {
      Head: "Pioneer's Heatproof Shell",
      Hand: "Pioneer's Lacuna Compass",
      Body: "Pioneer's Sealed Lead Apron",
      Feet: "Pioneer's Starfaring Anchor",
    },
  },
  'Prisoner in Deep Confinement': {
    name: '幽锁深牢的系囚',
    icon: image15,
    isInner: false,
    parts: {
      Head: "Prisoner's Sealed Muzzle",
      Hand: "Prisoner's Leadstone Shackles",
      Body: "Prisoner's Repressive Straitjacket",
      Feet: "Prisoner's Restrictive Fetters",
    },
  },
  'The Ashblazing Grand Duke': {
    name: '毁烬焚骨的大公',
    icon: image16,
    isInner: false,
    parts: {
      Head: "Grand Duke's Crown of Netherflame",
      Hand: "Grand Duke's Gloves of Fieryfur",
      Body: "Grand Duke's Robe of Grace",
      Feet: "Grand Duke's Ceremonial Boots",
    },
  },
  'The Wind-Soaring Valorous': {
    name: '风举云飞的勇烈',
    icon: image17,
    isInner: false,
    parts: {
      Head: "Champion's Headgear",
      Hand: "Champion's Heavy Gloves",
      Body: "Champion's Chest Guard",
      Feet: "Champion's Fleetfoot Boots",
    },
  },
  'Thief of Shooting Meteor': {
    name: '流星追迹的怪盗',
    icon: image18,
    isInner: false,
    parts: {
      Head: "Thief's Myriad-Faced Mask",
      Hand: "Thief's Gloves With Prints",
      Body: "Thief's Steel Grappling Hook",
      Feet: "Thief's Meteor Boots",
    },
  },
  'Wastelander of Banditry Desert': {
    name: '盗匪荒漠的废土客',
    icon: image19,
    isInner: false,
    parts: {
      Head: "Wastelander's Breathing Mask",
      Hand: "Wastelander's Desert Terminal",
      Body: "Wastelander's Friar Robe",
      Feet: "Wastelander's Powered Greaves",
    },
  },
  'Watchmaker, Master of Dream Machinations': {
    name: '机心戏梦的钟表匠',
    icon: image20,
    isInner: false,
    parts: {
      Head: "Watchmaker's Telescoping Lens",
      Hand: "Watchmaker's Fortuitous Wristwatch",
      Body: "Watchmaker's Illusory Formal Suit",
      Feet: "Watchmaker's Dream-Concealing Dress Shoes",
    },
  },
  'Belobog of the Architects': {
    name: '筑城者的贝洛伯格',
    icon: image21,
    isInner: true,
    parts: {
      Sphere: "Belobog's Fortress of Preservation",
      Rope: "Belobog's Iron Defense",
    },
  },
  'Broken Keel': {
    name: '折断的龙骨',
    icon: image22,
    isInner: true,
    parts: {
      Sphere: "Insumousu's Whalefall Ship",
      Rope: "Insumousu's Frayed Hawser",
    },
  },
  'Celestial Differentiator': {
    name: '星体差分机',
    icon: image23,
    isInner: true,
    parts: {
      Sphere: "Planet Screwllum's Mechanical Sun",
      Rope: "Planet Screwllum's Ring System",
    },
  },
  'Duran, Dynasty of Running Wolves': {
    name: '奔狼的都蓝王朝',
    icon: image24,
    isInner: true,
    parts: {
      Sphere: "Duran's Tent of Golden Sky",
      Rope: "Duran's Mechabeast Bridle",
    },
  },
  'Firmament Frontline: Glamoth': {
    name: '苍穹战线格拉默',
    icon: image25,
    isInner: true,
    parts: {
      Sphere: "Glamoth's Iron Cavalry Regiment",
      Rope: "Glamoth's Silent Tombstone",
    },
  },
  'Fleet of the Ageless': {
    name: '不老者的仙舟',
    icon: image26,
    isInner: true,
    parts: {
      Sphere: "The Xianzhou Luofu's Celestial Ark",
      Rope: "The Xianzhou Luofu's Ambrosial Arbor Vines",
    },
  },
  'Forge of the Kalpagni Lantern': {
    name: '劫火莲灯铸炼宫',
    icon: image27,
    isInner: true,
    parts: {
      Sphere: "Forge's Lotus Lantern Wick",
      Rope: "Forge's Heavenly Flamewheel Silk",
    },
  },
  'Inert Salsotto': {
    name: '停转的萨尔索图',
    icon: image28,
    isInner: true,
    parts: {
      Sphere: "Salsotto's Moving City",
      Rope: "Salsotto's Terminator Line",
    },
  },
  'Izumo Gensei and Takama Divine Realm': {
    name: '出云显世与高天神国',
    icon: image29,
    isInner: true,
    parts: {
      Sphere: "lzumo's Magatsu no Morokami",
      Rope: "lzumo's Blades of Origin and End",
    },
  },
  'Pan-Cosmic Commercial Enterprise': {
    name: '泛银河商业公司',
    icon: image30,
    isInner: true,
    parts: {
      Sphere: "The IPC's Mega HQ",
      Rope: "The IPC's Trade Route",
    },
  },
  'Penacony, Land of the Dreams	': {
    name: '梦想之地匹诺康尼',
    icon: image31,
    isInner: true,
    parts: {
      Sphere: "Penacony's Grand Hotel",
      Rope: "Penacony's Dream-Seeking Tracks",
    },
  },
  'Rutilant Arena': {
    name: '繁星竞技场',
    icon: image32,
    isInner: true,
    parts: {
      Sphere: 'Taikiyan Laser Stadium',
      Rope: "Taikiyan's Arclight Race Track",
    },
  },
  'Sigonia, the Unclaimed Desolation': {
    name: '无主荒星茨冈尼亚',
    icon: image33,
    isInner: true,
    parts: {
      Sphere: "Sigonia's Gaiathra Berth",
      Rope: "Sigonia's Knot of Cyclicality",
    },
  },
  'Space Sealing Station': {
    name: '太空封印站',
    icon: image34,
    isInner: true,
    parts: {
      Sphere: "Herta's Space Station",
      Rope: "Herta's Wandering Trek",
    },
  },
  'Sprightly Vonwacq': {
    name: '生命的翁瓦克',
    icon: image35,
    isInner: true,
    parts: {
      Sphere: "Vonwacq's Island of Birth",
      Rope: "Vonwacq's Islandic Coast",
    },
  },
  'Talia: Kingdom of Banditry': {
    name: '盗贼公国塔利亚',
    icon: image36,
    isInner: true,
    parts: {
      Sphere: "Talia's Nailscrap Town",
      Rope: "Talia's Exposed Electric Wire",
    },
  },
};

export enum RelicTitleType {
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
  'Taikiyan Laser Stadium',
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
}

export const FuzzyTitleSet = FuzzySet(Object.keys(RelicTitleType));
