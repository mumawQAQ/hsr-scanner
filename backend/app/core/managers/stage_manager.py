import importlib
import json
from typing import Dict

from loguru import logger

from app.constant import STAGE_CONFIG_PATH
from app.core.interfaces.pipeline_stage_interface import PipelineStageProtocol
from app.core.singleton import singleton


@singleton
class StageManager:
    _stages: Dict[str, PipelineStageProtocol] = {}

    def __init__(self):
        self.auto_register_stages(config_path=STAGE_CONFIG_PATH)

    def auto_register_stages(self, config_path: str = STAGE_CONFIG_PATH) -> None:
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except FileNotFoundError:
            logger.exception(f"config file {config_path} not found.")
            raise SystemExit()
        except json.JSONDecodeError:
            logger.exception(f"config file {config_path} parse error")
            raise SystemExit()

        for stage_config in config.get('stages', []):
            stage_cls_path = stage_config.get('class')
            stage_name = stage_config.get('name')

            if not stage_cls_path or not stage_name:
                logger.warning(f"config missing 'class' or 'name' field: {stage_config}")
                continue

            try:
                stage_path, class_name = stage_cls_path.rsplit('.', 1)
                module = importlib.import_module(stage_path)
                stage_cls = getattr(module, class_name)
                self.register_stage(stage_name, stage_cls(stage_name))
            except (ImportError, AttributeError) as e:
                logger.exception(f"unable to load class {stage_cls_path}")
                raise SystemExit()
            except Exception:
                logger.exception(f"unable to load class {stage_cls_path}")
                raise SystemExit()

    def register_stage(self, stage_name: str, stage: PipelineStageProtocol):
        self._stages[stage_name] = stage
        logger.info(f"Stage '{stage_name}' registered.")

    def get_stage(self, stage_name: str):
        if stage_name not in self._stages:
            logger.error(f"Stage '{stage_name}' is not registered.")
            return None
        return self._stages.get(stage_name)
