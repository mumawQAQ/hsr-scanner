from abc import abstractmethod
from typing import runtime_checkable, Protocol, TypeVar

T_INPUT = TypeVar("T_INPUT")
T_OUTPUT = TypeVar("T_OUTPUT")


@runtime_checkable
class ModelInterface(Protocol[T_INPUT, T_OUTPUT]):
    """Protocol defining the interface for models."""

    @staticmethod
    @abstractmethod
    def get_name() -> str:
        """Get the name of the model."""
        ...

    @abstractmethod
    def load(self) -> None:
        """Load the model resources."""
        ...

    @abstractmethod
    def predict(self, input_data: T_INPUT) -> T_OUTPUT:
        """Perform prediction on the input data."""
        ...
