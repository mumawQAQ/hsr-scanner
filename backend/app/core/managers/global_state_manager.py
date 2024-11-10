from typing import Dict, Any


class GlobalStateManager:
    """Singleton class to manage global state"""

    _instance = None
    _state = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GlobalStateManager, cls).__new__(cls)
        return cls._instance

    def update_state(self, new_state: Dict[str, Any]) -> None:
        """Update the global state with new state"""
        self._state.update(new_state)

    def get_state(self) -> Dict[str, Any]:
        """Return the current global state"""
        return self._state
