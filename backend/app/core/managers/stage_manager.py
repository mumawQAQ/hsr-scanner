import importlib
import json
from typing import Dict

from loguru import logger

from app.constant import STAGE_CONFIG_PATH
from app.core.interfaces.pipeline_stage_interface import PipelineStageInterface
from app.core.singleton import singleton


@singleton
class StageManager:
    _stages: Dict[str, PipelineStageInterface] = {}

    def __init__(self):
        self.auto_register_stages(config_path=STAGE_CONFIG_PATH)

    def auto_register_stages(self, config_path: str = STAGE_CONFIG_PATH) -> None:
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except FileNotFoundError:
            logger.exception(f"配置文件不存在: {config_path}")
            raise SystemExit()
        except json.JSONDecodeError:
            logger.exception(f"配置文件解析失败: {config_path}")
            raise SystemExit()

        for stage_config in config.get('stages', []):
            stage_cls_path = stage_config.get('class')

            if not stage_cls_path:
                logger.warning(f"配置文件缺少 'class' 字段: {stage_config}")
                continue

            try:
                stage_path, class_name = stage_cls_path.rsplit('.', 1)
                module = importlib.import_module(stage_path)
                stage_cls: PipelineStageInterface = getattr(module, class_name)
                self.register_stage(stage_cls.get_name(), stage_cls())
            except (ImportError, AttributeError) as e:
                logger.exception(f"无法加载阶段类{stage_cls_path}")
                raise SystemExit()
            except Exception:
                logger.exception(f"无法加载阶段类{stage_cls_path}")
                raise SystemExit()

    def register_stage(self, stage_name: str, stage: PipelineStageInterface):
        self._stages[stage_name] = stage
        logger.info(f"阶段'{stage_name}'加载成功")

    def get_stage(self, stage_name: str):
        if stage_name not in self._stages:
            logger.error(f"无法获取阶段: {stage_name}, 阶段未注册")
            return None
        return self._stages.get(stage_name)
