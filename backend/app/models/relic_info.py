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
    scores: list[float]


class RelicInfo(BaseModel):
    title: RelicTitle
    main_stat: RelicMainStat
    sub_stats: list[RelicSubStat]
