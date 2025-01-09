import importlib
import json
import os
from typing import Dict, Optional

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
            logger.exception(f"config file {config_path} not found.")
            raise SystemExit()
        except json.JSONDecodeError:
            logger.exception(f"config file {config_path} parse error")
            raise SystemExit()

        for model_config in config.get('models', []):
            model_cls_path = model_config.get('class')
            model_name = model_config.get('name')
            model_params = model_config.get('params', {})

            if not model_cls_path or not model_name:
                logger.warning(f"config missing 'class' or 'name' field: {model_config}")
                raise SystemExit()

            try:
                model_cls = self.load_class(model_cls_path)
            except (ImportError, AttributeError) as e:
                logger.exception(f"unable to load class {model_cls_path}")
                raise SystemExit()

            resolved_params = {}
            for key, value in model_params.items():
                if value.get('type') == 'path':
                    # relative path
                    resolved_params[key] = os.path.join(ROOT_PATH, value['value'])
                elif value.get('type') == 'class':
                    try:
                        resolved_class = self.load_class(value['value'])
                        resolved_params[key] = resolved_class()
                    except (ImportError, AttributeError):
                        logger.exception(f"unable to load class {value['value']}")
                        raise SystemExit()

                else:
                    resolved_params[key] = value['value']
            try:
                model_instance = model_cls(**resolved_params)
            except Exception:
                logger.exception(f"unable to instantiate class {model_cls_path}")
                raise SystemExit()

            try:
                self.register_model(model_name, model_instance)
            except Exception:
                logger.exception(f"unable to register model '{model_name}'")
                raise SystemExit()

    def register_model(self, name: str, model: ModelInterface) -> None:
        """Register and load a model."""
        if name in self._models:
            logger.warning(f"Model '{name}' is already registered.")
            return

        model.load()
        self._models[name] = model
        logger.info(f"Model '{name}' registered and loaded.")

    def get_model(self, name: str) -> Optional[ModelInterface]:
        """Retrieve a registered model."""
        if name not in self._models:
            logger.error(f"Model '{name}' is not registered.")
            return None

        return self._models[name]
