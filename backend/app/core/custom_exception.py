class ModelNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message


class StageResultNotFoundException(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message
