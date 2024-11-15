import os

GAME_TITLES = ['Honkai: Star Rail']

RELIC_INNER_PARTS = ['sphere', 'rope']
RELIC_OUTER_PARTS = ['head', 'hand', 'body', 'feet']

CHARACTERS_FILE = os.path.join(os.path.dirname(__file__), 'assets', 'character', 'character_meta.json')

TASK_CONFIG_PATH = os.path.join(os.path.dirname(__file__), 'assets', 'configs', 'task_config.json')
TASK_SCHEMA_PATH = os.path.join(os.path.dirname(__file__), 'assets', 'configs', 'task_config.schema.json')

YOLO_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'assets', 'yolo_model', 'best.pt')

RELIC_DATA_FOLDER = os.path.join(os.path.dirname(__file__), 'assets', 'relic')
RELIC_SETS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sets.json')
RELIC_MAIN_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_main_stats.json')
RELIC_SUB_STATS_FILE = os.path.join(RELIC_DATA_FOLDER, 'relic_sub_stats.json')

IMG_TEMPLATE_FOLDER = os.path.join(os.path.dirname(__file__), 'assets', 'img_templates')
DISCARD_ICON_PATH = os.path.join(IMG_TEMPLATE_FOLDER, 'discard_icon.png')

RELIC_STATS_MAPPING = {
    "DEF": "防御",
    "HP": "生命",
    "HPPercentage": "生命百分比",
    "ATK": "攻击",
    "ATKPercentage": "攻击百分比",
    "DEFPercentage": "防御百分比",
    "SPD": "速度",
    "CRITRate": "暴击率",
    "CRITDMG": "暴击伤害",
    "BreakEffect": "击破特攻",
    "EffectHitRate": "效果命中",
    "EffectRES": "效果抵抗",
    "OutgoingHealingBoost": "治疗量加成",
    "EnergyRegenerationRate": "能量回复效率",
    "PhysicalDMGBoost": "物理属性伤害提高",
    "FireDMGBoost": "火属性伤害提高",
    "IceDMGBoost": "冰属性伤害提高",
    "LightningDMGBoost": "雷属性伤害提高",
    "WindDMGBoost": "风属性伤害提高",
    "QuantumDMGBoost": "量子属性伤害提高",
    "ImaginaryDMGBoost": "虚数属性伤害提高",
}

Relic_Sub_Stats_Acquire_Scale = {
    '生命': 125,
    '攻击': 125,
    '防御': 125,
    "生命百分比": 125,
    "攻击百分比": 125,
    "防御百分比": 125,
    "效果命中": 100,
    "效果抵抗": 100,
    "击破特攻": 100,
    "暴击率": 75,
    "暴击伤害": 75,
    "速度": 50,
}

Relic_Sub_Stats_Total_Acquire_Scale = sum(Relic_Sub_Stats_Acquire_Scale.values())
