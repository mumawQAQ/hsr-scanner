import re
from typing import Optional, List, Any, Dict

import cv2
from loguru import logger
from numpy import ndarray

from app.core.data_models.pipeline_context import PipelineContext
from app.core.data_models.stage_result import StageResult, StageResultMetaData
from app.core.interfaces.impls.base_pipeline_stage import BasePipelineStage
from app.core.interfaces.model_interface import ModelInterface
from app.core.managers.model_manager import ModelManager
from app.core.model_impls.relic_matcher_model import RelicMatcherInput, RelicMatcherInputType
from app.core.network_models.responses.relic_ocr_response import RelicOCRResponse

OCR_CONFIDENCE_THRESHOLD = 0.7


def pp_relic_stat_img(img: ndarray, split_ratio: float) -> tuple[ndarray, ndarray]:
    stat_name_area = img[:, : int(img.shape[1] * split_ratio)]
    stat_val_area = img[:, int(img.shape[1] * split_ratio):]
    stat_val_area = cv2.resize(stat_val_area, None, fx=2, fy=2, interpolation=cv2.INTER_LINEAR)

    return stat_name_area, stat_val_area


def pp_ocr_result(ocr_result: List[Any]) -> Optional[List[Any]]:
    if not ocr_result:
        logger.error("无效OCR结果, OCR结果为空")
        return None

    return ocr_result[0]


def format_relic_title(ocr_result: List[Any]) -> Optional[str]:
    ocr_result = pp_ocr_result(ocr_result)
    if not ocr_result:
        return None

    relic_title = ""
    for result in ocr_result:
        title_part, confidence = result[1]
        if confidence < OCR_CONFIDENCE_THRESHOLD:
            continue
        relic_title += title_part

    relic_title = re.sub(r"[^a-zA-Z- ']", "", relic_title)

    if len(relic_title) == 0:
        logger.error(f"无效遗器标题: {relic_title}")
        return None

    return relic_title


def format_relic_main_stat(
        relic_main_stat_name_ocr_result: List[Any],
        relic_main_stat_val_ocr_result: List[Any]
) -> Optional[Dict[str, str]]:
    relic_main_stat_val_ocr_result = pp_ocr_result(relic_main_stat_val_ocr_result)
    relic_main_stat_name_ocr_result = pp_ocr_result(relic_main_stat_name_ocr_result)

    if not relic_main_stat_name_ocr_result or not relic_main_stat_val_ocr_result:
        logger.error(
            f"无效OCR遗器主属性名称或者主属性值: {relic_main_stat_name_ocr_result} ----> {relic_main_stat_val_ocr_result}"
        )
        return None

    if len(relic_main_stat_name_ocr_result) < 1:
        logger.error(f"无效遗器主属性名称: {relic_main_stat_name_ocr_result}")
        return None

    if len(relic_main_stat_val_ocr_result) < 1:
        logger.error(f"无效遗器主属性值: {relic_main_stat_val_ocr_result}")
        return None

    relic_main_stat_name, confidence = relic_main_stat_name_ocr_result[0][1]
    if confidence < OCR_CONFIDENCE_THRESHOLD:
        logger.error(f"OCR遗器主属性置信度过低: {confidence}")
        return None

    relic_main_stat_val, confidence = relic_main_stat_val_ocr_result[0][1]
    if confidence < OCR_CONFIDENCE_THRESHOLD:
        logger.error(f"OCR遗器主属性值置信度过低: {confidence}")
        return None

    relic_main_stat_name = relic_main_stat_name.strip().replace(' ', '')
    relic_main_stat_val = relic_main_stat_val.strip().replace(' ', '')

    if relic_main_stat_name in ['HP', 'ATK', 'DEF'] and relic_main_stat_val.endswith('%'):
        relic_main_stat_name += 'Percentage'

    return {
        "relic_main_stat": relic_main_stat_name,
        "relic_main_stat_val": relic_main_stat_val
    }


def format_relic_sub_stat(
        relic_sub_stat_name_ocr_result: List[Any],
        relic_sub_stat_val_ocr_result: List[Any]
) -> Optional[Dict[str, str]]:
    relic_sub_stat_val_ocr_result = pp_ocr_result(relic_sub_stat_val_ocr_result)
    relic_sub_stat_name_ocr_result = pp_ocr_result(relic_sub_stat_name_ocr_result)
    if not relic_sub_stat_name_ocr_result or not relic_sub_stat_val_ocr_result:
        return None

    min_result_count = 3
    max_result_count = 4

    if len(relic_sub_stat_name_ocr_result) < min_result_count:
        logger.error(f"遗器副属性数量低于最小值(3): {relic_sub_stat_name_ocr_result}")
        return None

    if len(relic_sub_stat_val_ocr_result) > max_result_count:
        logger.error(f"遗器副属性数量大于最大值(4): {relic_sub_stat_val_ocr_result}")
        return None

    format_result = {}

    for idx in range(len(relic_sub_stat_name_ocr_result)):
        name, confidence = relic_sub_stat_name_ocr_result[idx][1]
        if confidence < OCR_CONFIDENCE_THRESHOLD:
            logger.error(f"OCR遗器副属性名称置信度过低: {confidence}")
            return None

        # in the manually set sub stat area, sub stat val can be empty
        if idx >= len(relic_sub_stat_val_ocr_result):
            logger.error(
                f"副属性名称数量和值数量不匹配: {relic_sub_stat_name_ocr_result} {relic_sub_stat_val_ocr_result}")
            continue

        val, confidence = relic_sub_stat_val_ocr_result[idx][1]
        if confidence < OCR_CONFIDENCE_THRESHOLD:
            logger.error(f"OCR遗器副属性值置信度过低: {confidence}")
            return None

        format_name = name.strip().replace(' ', '')
        format_val = val.strip().replace(' ', '')

        try:
            # in the manually set sub stat area, this can also include the relic description, just ignore it
            if format_val.endswith('%'):
                float(format_val[:-1])
            else:
                int(format_val)
        except ValueError:
            logger.error(f"无效遗器副属性值: {format_val}")
            continue

        if format_name in ['HP', 'ATK', 'DEF'] and format_val.endswith('%'):
            format_name += 'Percentage'

        format_result[format_name] = format_val

    return format_result


class OCRStage(BasePipelineStage):

    async def process(self, context: PipelineContext) -> StageResult:
        try:
            auto_detect_relic_box_position = context.meta_data.get('auto_detect_relic_box_position', True)
            ocr_model = ModelManager().get_model("ocr")
            relic_matcher_model = ModelManager().get_model("relic_matcher")

            if not ocr_model:
                error_msg = "OCR模组未找到, 请联系开发者"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if not relic_matcher_model:
                error_msg = "遗器匹配模组未找到, 请联系开发者"
                logger.error(error_msg)
                return StageResult(
                    success=False,
                    data=None,
                    error=error_msg
                )

            if auto_detect_relic_box_position:
                detection_data = context.data.get("detection_stage")
                if not detection_data:
                    error_msg = "未检测到数据, 可能是YOLO模型无法检测到遗器位置, 如果此错误频繁发生, 请尝试手动设置遗器位置。"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        error=error_msg,
                        data=None
                    )

                if "relic-title" in detection_data:
                    relic_title_image = detection_data["relic-title"]["image"]
                else:
                    error_msg = "遗器标题检测数据未找到, YOLO模型无法检测到遗器位置, 如果此错误频繁发生, 请尝试手动设置遗器位置。"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        error=error_msg,
                        data=None
                    )

                if "relic-main-stat" in detection_data:
                    relic_main_stat_image = detection_data["relic-main-stat"]["image"]
                else:
                    error_msg = "遗器主属性检测数据未找到, YOLO模型无法检测到遗器位置, 如果此错误频繁发生, 请尝试手动设置遗器位置。"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        error=error_msg,
                        data=None
                    )

                if "relic-sub-stat" in detection_data:
                    relic_sub_stat_image = detection_data["relic-sub-stat"]["image"]
                else:
                    error_msg = "遗器副属性检测数据未找到, YOLO模型无法检测到遗器位置, 如果此错误频繁发生, 请尝试手动设置遗器位置。"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        error=error_msg,
                        data=None
                    )
            else:
                screenshot = context.data.get("screenshot_stage")
                relic_title_box = context.meta_data.get('relic_title_box', None)
                relic_main_stat_box = context.meta_data.get('relic_main_stat_box', None)
                relic_sub_stat_box = context.meta_data.get('relic_sub_stat_box', None)

                if not screenshot:
                    error_msg = "无法获取到截图数据, 请联系开发者"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )

                if not relic_title_box or not relic_main_stat_box or not relic_sub_stat_box:
                    error_msg = "遗器框选数据未找到, 如果你禁用了自动检测遗器位置, 你需要手动设置遗器位置。"
                    logger.error(error_msg)
                    return StageResult(
                        success=False,
                        data=None,
                        error=error_msg
                    )
                img_np = screenshot['image']

                relic_title_box_x1 = relic_title_box['x']
                relic_title_box_y1 = relic_title_box['y']
                relic_title_box_x2 = relic_title_box_x1 + relic_title_box['w']
                relic_title_box_y2 = relic_title_box_y1 + relic_title_box['h']

                relic_main_stat_box_x1 = relic_main_stat_box['x']
                relic_main_stat_box_y1 = relic_main_stat_box['y']
                relic_main_stat_box_x2 = relic_main_stat_box_x1 + relic_main_stat_box['w']
                relic_main_stat_box_y2 = relic_main_stat_box_y1 + relic_main_stat_box['h']

                relic_sub_stat_box_x1 = relic_sub_stat_box['x']
                relic_sub_stat_box_y1 = relic_sub_stat_box['y']
                relic_sub_stat_box_x2 = relic_sub_stat_box_x1 + relic_sub_stat_box['w']
                relic_sub_stat_box_y2 = relic_sub_stat_box_y1 + relic_sub_stat_box['h']

                relic_title_image = img_np[relic_title_box_y1:relic_title_box_y2, relic_title_box_x1:relic_title_box_x2]
                relic_main_stat_image = img_np[relic_main_stat_box_y1:relic_main_stat_box_y2,
                                        relic_main_stat_box_x1:relic_main_stat_box_x2]
                relic_sub_stat_image = img_np[relic_sub_stat_box_y1:relic_sub_stat_box_y2,
                                       relic_sub_stat_box_x1:relic_sub_stat_box_x2]

            relic_title = None
            relic_main_stat = None
            relic_sub_stat = None

            relic_title_info = self.__handle_relic_title_ocr(ocr_model, relic_title_image)
            if relic_title_info:
                relic_title = relic_matcher_model.predict(RelicMatcherInput(
                    type=RelicMatcherInputType.RELIC_TITLE,
                    data=relic_title_info,
                ))

            relic_main_stat_info = self.__handle_relic_main_stat_ocr(ocr_model, relic_main_stat_image)
            if relic_main_stat_info:
                relic_main_stat = relic_matcher_model.predict(RelicMatcherInput(
                    type=RelicMatcherInputType.RELIC_MAIN_STAT,
                    data=relic_main_stat_info,
                ))

            relic_sub_stat_info = self.__handle_relic_sub_stat_ocr(ocr_model, relic_sub_stat_image)
            if relic_sub_stat_info:
                relic_sub_stat = relic_matcher_model.predict(RelicMatcherInput(
                    type=RelicMatcherInputType.RELIC_SUB_STAT,
                    data=relic_sub_stat_info,
                ))

            relic_ocr_response = RelicOCRResponse(
                relic_title=relic_title,
                relic_main_stat=relic_main_stat,
                relic_sub_stat=relic_sub_stat
            )

            logger.debug(f"OCR data: {relic_ocr_response}")

            return StageResult(
                success=True,
                data=relic_ocr_response,
                metadata=StageResultMetaData(send_to_frontend=True)
            )
        except Exception as e:
            logger.exception(f"遗器OCR阶段异常")
            return StageResult(success=False, data=None, error=str(e))

    def __handle_relic_title_ocr(self, ocr_model: ModelInterface, img: ndarray) -> Optional[str]:
        result = ocr_model.predict(img)
        return format_relic_title(result)

    def __handle_relic_main_stat_ocr(self, ocr_model: ModelInterface, img: ndarray) -> Optional[
        Dict[str, str]]:
        # TODO: make the split ratio read from config file, this should not be hardcoded
        stat_name_area, stat_val_area = pp_relic_stat_img(img, 0.7)
        name_result = ocr_model.predict(stat_name_area)
        val_result = ocr_model.predict(stat_val_area)
        return format_relic_main_stat(name_result, val_result)

    def __handle_relic_sub_stat_ocr(self, ocr_model: ModelInterface, img: ndarray) -> Optional[
        Dict[str, str]]:
        # TODO: make the split ratio read from config file, this should not be hardcoded
        stat_name_area, stat_val_area = pp_relic_stat_img(img, 0.7)
        name_result = ocr_model.predict(stat_name_area)
        val_result = ocr_model.predict(stat_val_area)
        return format_relic_sub_stat(name_result, val_result)
