from typing import Dict

from app.core.interfaces.model_interface import ModelInterface
from app.core.singleton import singleton
from app.logging_config import logger


@singleton
class ModelManager:
    """Singleton manager for handling global models."""
    _models: Dict[str, ModelInterface] = {}

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
