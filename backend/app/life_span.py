import io
import json
import os
import sys
from contextlib import asynccontextmanager
from typing import Optional, Dict, Any

from fastapi import FastAPI
from loguru import logger

from app.constant import ROOT_PATH
from app.core.managers.global_state_manager import GlobalStateManager
from app.core.managers.model_manager import ModelManager
from app.core.managers.stage_manager import StageManager
from app.core.utils import database
from app.core.utils.formatter import Formatter
from app.core.utils.template_en_decode import TemplateEnDecoder
from app.logging_config import set_log_level

model_manager: Optional[ModelManager] = None
formatter: Optional[Formatter] = None
template_en_decoder: Optional[TemplateEnDecoder] = None
global_state_manager: Optional[GlobalStateManager] = None
stage_manager: Optional[StageManager] = None
state_machine_config: Dict[str, Any] = {}


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


def get_stage_manager() -> StageManager:
    if stage_manager is None:
        raise RuntimeError("StageManager not initialized")
    return stage_manager


def get_state_machine_config() -> Dict[str, Any]:
    if state_machine_config is None:
        raise RuntimeError("State machine config not initialized")
    return state_machine_config


@asynccontextmanager
async def life_span(app: FastAPI):
    global model_manager
    global formatter
    global template_en_decoder
    global global_state_manager
    global stage_manager
    global state_machine_config

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    set_log_level("INFO")

    logger.info("正在初始化后端服务...")

    # Init pipeline configs
    with open(os.path.join(ROOT_PATH, "assets", "configs", "state_machine_config.json"), 'r',
              encoding='utf-8') as f:
        state_machine_config = json.load(f)

    # Init the template en decoder
    logger.info("正在初始化模板解码器...")
    template_en_decoder = TemplateEnDecoder()

    # Init the formatter
    logger.info("正在初始化格式化器...")
    formatter = Formatter()

    # Init the managers
    global_state_manager = GlobalStateManager()
    model_manager = ModelManager()
    stage_manager = StageManager()

    logger.info("正在初始化数据库...")
    # Init the database
    database.init_db()

    yield

    database.close_db()
