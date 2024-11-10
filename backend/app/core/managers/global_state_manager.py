from typing import Dict, Any

from app.core.singleton import singleton


@singleton
class GlobalStateManager:
    _state = {}

    def update_state(self, new_state: Dict[str, Any]) -> None:
        """Update the global state with new state"""
        self._state.update(new_state)

    def get_state(self) -> Dict[str, Any]:
        """Return the current global state"""
        return self._state
