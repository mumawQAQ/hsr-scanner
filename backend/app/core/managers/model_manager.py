import importlib
import json
import os
from typing import Dict

from loguru import logger

from app.constant import MODEL_CONFIG_PATH, ROOT_PATH
from app.core.interfaces.model_interface import ModelInterface
from app.core.singleton import singleton


@singleton
class ModelManager:
    """Singleton manager for handling global models."""
    _models: Dict[str, ModelInterface] = {}

    def __init__(self):
        self.auto_register_models(config_path=MODEL_CONFIG_PATH)

    def load_class(self, import_path: str) -> ModelInterface:
        module_path, class_name = import_path.rsplit('.', 1)
        module = importlib.import_module(module_path)
        cls = getattr(module, class_name)
        return cls

    def auto_register_models(self, config_path: str = MODEL_CONFIG_PATH) -> None:
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
        except FileNotFoundError:
            logger.error(f"配置文件 {config_path} 不存在。")
            return
        except json.JSONDecodeError as e:
            logger.error(f"配置文件 {config_path} 解析失败: {e}")
            return

        for model_config in config.get('models', []):
            model_cls_path = model_config.get('class')
            model_name = model_config.get('name')
            model_params = model_config.get('params', {})

            if not model_cls_path or not model_name:
                logger.warning(f"模型配置缺少 'class' 或 'name' 字段: {model_config}")
                continue

            try:
                model_cls = self.load_class(model_cls_path)
            except (ImportError, AttributeError) as e:
                logger.error(f"无法加载类 '{model_cls_path}': {e}")
                continue

            resolved_params = {}
            for key, value in model_params.items():
                if isinstance(value, str) and '.' in value:
                    try:
                        resolved_class = self.load_class(value)
                        resolved_params[key] = resolved_class()
                    except (ImportError, AttributeError):
                        if 'path' in key:
                            # relative path
                            resolved_params[key] = os.path.join(ROOT_PATH, value)
                        else:
                            resolved_params[key] = value
                else:
                    resolved_params[key] = value

            try:
                model_instance = model_cls(**resolved_params)
            except Exception as e:
                logger.error(f"instance '{model_name}' error: {e}")
                continue

            try:
                self.register_model(model_name, model_instance)
            except Exception as e:
                logger.error(f"register '{model_name}' error: {e}")
                continue

    def register_model(self, name: str, model: ModelInterface) -> None:
        """Register and load a model."""
        if name in self._models:
            raise ValueError(f"Model '{name}' is already registered.")
        model.load()
        self._models[name] = model
        logger.info(f"Model '{name}' registered and loaded.")

    def get_model(self, name: str) -> ModelInterface:
        """Retrieve a registered model."""
        if name not in self._models:
            raise ValueError(f"Model '{name}' is not registered.")
        return self._models[name]
