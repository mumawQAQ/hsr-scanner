from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI

from app.constant import YOLO_MODEL_PATH, RELIC_SETS_FILE, RELIC_MAIN_STATS_FILE, RELIC_SUB_STATS_FILE
from app.core.managers.global_state_manager import GlobalStateManager
from app.core.managers.model_manager import ModelManager
from app.core.managers.pipeline_manager import PipelineManager
from app.core.managers.websocket_manager import WebsocketManager
from app.core.model_impls.keyboard_model import KeyboardModel
from app.core.model_impls.ocr_model import OCRModel
from app.core.model_impls.relic_matcher_model import RelicMatcherModel
from app.core.model_impls.relic_rating_model import RelicRatingModel
from app.core.model_impls.yolo_model import YOLOModel
from app.core.pipeline_executer import PipelineExecutor
from app.core.pipline_impls.auto_relic_analysis_pipeline import AutoRelicAnalysisPipeline
from app.core.pipline_impls.single_relic_analysis_pipeline import SingleRelicAnalysisPipeline
from app.core.utils import database
from app.core.utils.formatter import Formatter
from app.core.utils.template_en_decode import TemplateEnDecoder

websocket_manager: Optional[WebsocketManager] = None
pipeline_manager: Optional[PipelineManager] = None
model_manager: Optional[ModelManager] = None
pipeline_executor: Optional[PipelineExecutor] = None
formatter: Optional[Formatter] = None
template_en_decoder: Optional[TemplateEnDecoder] = None
global_state_manager: Optional[GlobalStateManager] = None


def get_websocket_manager() -> WebsocketManager:
    if websocket_manager is None:
        raise RuntimeError("WebsocketManager not initialized")
    return websocket_manager


def get_pipeline_manager() -> PipelineManager:
    if pipeline_manager is None:
        raise RuntimeError("PipelineManager not initialized")
    return pipeline_manager


def get_pipeline_executor() -> PipelineExecutor:
    if pipeline_executor is None:
        raise RuntimeError("PipelineExecutor not initialized")
    return pipeline_executor


def get_model_manager() -> ModelManager:
    if model_manager is None:
        raise RuntimeError("ModelManager not initialized")
    return model_manager


def get_formatter() -> Formatter:
    if formatter is None:
        raise RuntimeError("Formatter not initialized")
    return formatter


def get_template_en_decoder() -> TemplateEnDecoder:
    if template_en_decoder is None:
        raise RuntimeError("TemplateEnDecoder not initialized")
    return template_en_decoder


def get_global_state_manager() -> GlobalStateManager:
    if global_state_manager is None:
        raise RuntimeError("GlobalStateManager not initialized")
    return global_state_manager


@asynccontextmanager
async def life_span(app: FastAPI):
    global websocket_manager
    global pipeline_manager
    global pipeline_executor
    global model_manager
    global formatter
    global template_en_decoder
    global global_state_manager

    # Init the template en decoder
    template_en_decoder = TemplateEnDecoder()

    # Init the formatter
    formatter = Formatter()

    # Init the managers
    global_state_manager = GlobalStateManager()
    websocket_manager = WebsocketManager()
    pipeline_manager = PipelineManager()
    model_manager = ModelManager()
    pipeline_executor = PipelineExecutor(websocket_manager)

    # Register the pipelines
    pipeline_manager.register_pipeline(SingleRelicAnalysisPipeline)
    pipeline_manager.register_pipeline(AutoRelicAnalysisPipeline)

    # Register the models
    model_manager.register_model("yolo", YOLOModel(YOLO_MODEL_PATH))
    model_manager.register_model("ocr", OCRModel())
    model_manager.register_model("relic_matcher", RelicMatcherModel(
        relic_sets_path=RELIC_SETS_FILE,
        relic_main_stats_path=RELIC_MAIN_STATS_FILE,
        relic_sub_stats_path=RELIC_SUB_STATS_FILE,
    ))
    model_manager.register_model("relic_rating", RelicRatingModel(global_state_manager))
    model_manager.register_model("keyboard", KeyboardModel())

    # Init the database
    database.init_db()
    yield

    database.close_db()
