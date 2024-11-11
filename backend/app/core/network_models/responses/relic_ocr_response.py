from typing import List, Optional

from pydantic import BaseModel

from app.core.data_models.relic_info import RelicTitle, RelicMainStat, RelicSubStat


class RelicOCRResponse(BaseModel):
    relic_title: Optional[RelicTitle] = None
    relic_main_stat: Optional[RelicMainStat] = None
    relic_sub_stat: Optional[List[RelicSubStat]] = None
