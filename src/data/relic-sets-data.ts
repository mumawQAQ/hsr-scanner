import image1 from '@/assets/icon/relic/1.png';
import image10 from '@/assets/icon/relic/10.png';
import image11 from '@/assets/icon/relic/11.png';
import image12 from '@/assets/icon/relic/12.png';
import image13 from '@/assets/icon/relic/13.png';
import image14 from '@/assets/icon/relic/14.png';
import image15 from '@/assets/icon/relic/15.png';
import image16 from '@/assets/icon/relic/16.png';
import image17 from '@/assets/icon/relic/17.png';
import image18 from '@/assets/icon/relic/18.png';
import image19 from '@/assets/icon/relic/19.png';
import image2 from '@/assets/icon/relic/2.png';
import image20 from '@/assets/icon/relic/20.png';
import image21 from '@/assets/icon/relic/21.png';
import image22 from '@/assets/icon/relic/22.png';
import image23 from '@/assets/icon/relic/23.png';
import image24 from '@/assets/icon/relic/24.png';
import image25 from '@/assets/icon/relic/25.png';
import image26 from '@/assets/icon/relic/26.png';
import image27 from '@/assets/icon/relic/27.png';
import image28 from '@/assets/icon/relic/28.png';
import image29 from '@/assets/icon/relic/29.png';
import image3 from '@/assets/icon/relic/3.png';
import image30 from '@/assets/icon/relic/30.png';
import image31 from '@/assets/icon/relic/31.png';
import image32 from '@/assets/icon/relic/32.png';
import image33 from '@/assets/icon/relic/33.png';
import image34 from '@/assets/icon/relic/34.png';
import image35 from '@/assets/icon/relic/35.png';
import image36 from '@/assets/icon/relic/36.png';
import image4 from '@/assets/icon/relic/4.png';
import image5 from '@/assets/icon/relic/5.png';
import image6 from '@/assets/icon/relic/6.png';
import image7 from '@/assets/icon/relic/7.png';
import image8 from '@/assets/icon/relic/8.png';
import image9 from '@/assets/icon/relic/9.png';

export const RelicSetsData: {
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
      Head: 'Valorous Mask of Northern Skies',
      Hand: 'Valorous Bracelet of Grappling Hooks',
      Body: 'Valorous Plate of Soaring Flight',
      Feet: 'Valorous Greaves of Pursuing Hunt',
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
