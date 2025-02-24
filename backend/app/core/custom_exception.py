class ModelNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class StageResultNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class WindowNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class IconNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class RelicMatchNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
