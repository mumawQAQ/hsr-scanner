from pydantic import BaseModel


class RelicTitle(BaseModel):
    title: str
    set_name: str
    part: str


class RelicMainStat(BaseModel):
    name: str
    number: str
    level: int
    enhance_level: int


class RelicSubStat(BaseModel):
    name: str
    number: str
    score: list[float]


class RelicInfo(BaseModel):
    title: RelicTitle
    main_stat: RelicMainStat
    sub_stats: list[RelicSubStat]


class RelicImg(BaseModel):
    title_img: str
    main_stat_img: str
    sub_stat_img: str


class RelicScore(BaseModel):
    score: float
    characters: list[str]
    type: str
