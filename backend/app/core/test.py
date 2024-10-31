import asyncio
import json
import uuid
from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional, List, Any, Dict, Callable, TypeVar, Generic

import torch
from pydantic import BaseModel
from ultralytics import YOLO

# Assuming these paths are correctly set in app.constant
from app.constant import YOLO_MODEL_PATH, TASK_CONFIG_PATH


class EventType(Enum):
    TASK = 'task'


class TaskType(Enum):
    SUPER_TASK = 'super_task'
    SCREENSHOT = 'screenshot'
    OCR = 'ocr'
    YOLO = 'yolo'


class SubTaskInfo(BaseModel):
    task_type: TaskType
    parameters: Dict[str, Any]
    dependencies: List[str] = []  # list of task ids on which this task depends


class EventResult(BaseModel):
    pass


class TaskResult(EventResult):
    status: bool  # true if task is successful, false otherwise
    result: Any  # result of the task
    error: Optional[str] = None


T = TypeVar('T', bound=EventResult)
EventCallback = Callable[[T], None]  # Correctly defined as a type alias


class EventBus(Generic[T]):
    """
    Event bus to publish and subscribe to events.
    """

    def __init__(self):
        self._subscribers: Dict[str, List[EventCallback]] = {}  # Removed [T] inside List
        self._lock = asyncio.Lock()

    @staticmethod
    def generate_event_key(event_type: EventType, event_id: Optional[str] = None) -> str:
        """
        Generate a unique key for an event based on event type and event id.
        """
        if not event_id:
            return event_type.value
        return f"{event_type.value}_{event_id}"

    async def publish(self, event_result: T, event_type: EventType, event_id: Optional[str] = None) -> None:
        """
        Publish an event to all subscribers.
        """
        event_key = self.generate_event_key(event_type, event_id)
        async with self._lock:
            subscribers = self._subscribers.get(event_key, []).copy()
        for callback in subscribers:
            asyncio.create_task(callback(event_result))  # Callback is called without invoking EventCallback(T)

    async def subscribe(self, callback: EventCallback, event_type: EventType,
                        event_id: Optional[str] = None) -> None:
        """
        Subscribe to an event.
        """
        event_key = self.generate_event_key(event_type, event_id)
        async with self._lock:
            if event_key not in self._subscribers:  # Corrected to check event_key
                self._subscribers[event_key] = []
            self._subscribers[event_key].append(callback)  # Append the callback directly

    async def unsubscribe(self, callback: EventCallback, event_type: EventType,
                          event_id: Optional[str] = None) -> None:
        """
        Unsubscribe from an event.
        """
        event_key = self.generate_event_key(event_type, event_id)
        async with self._lock:
            if event_key in self._subscribers:
                try:
                    self._subscribers[event_key].remove(callback)
                    if not self._subscribers[event_key]:
                        del self._subscribers[event_key]
                except ValueError:
                    pass  # Callback not found; ignore


class Task(ABC):
    def __init__(
            self,
            task_id: str,
            event_bus: EventBus[TaskResult],
            dependencies: Optional[List[str]] = None,
            retry: int = 0
    ):
        self.task_id = task_id
        self.event_bus = event_bus
        self.dependencies = dependencies or []
        self.retry = retry
        self.dependency_results: Dict[str, TaskResult] = {}

    async def execute(self):
        await self.wait_for_dependencies()
        result = await self.run()
        await self.handle_retry(result, self.retry)

    async def wait_for_dependencies(self) -> None:
        if self.dependencies:
            print(f"Task {self.task_id}: Waiting for dependencies: {self.dependencies}")

            results = await asyncio.gather(
                *[self.wait_for_event(event) for event in self.dependencies]
            )
            for dep_id, data in zip(self.dependencies, results):
                self.dependency_results[dep_id] = data

    async def wait_for_event(self, task_id: str) -> TaskResult:
        event = asyncio.Event()
        result: Optional[TaskResult] = None

        async def completed_callback(task_result: TaskResult) -> None:
            nonlocal result
            result = task_result
            event.set()

        await self.event_bus.subscribe(completed_callback, EventType.TASK, task_id)
        await event.wait()
        await self.event_bus.unsubscribe(completed_callback, EventType.TASK, task_id)

        if result is None:
            raise Exception(f"Task {task_id} did not return any result.")
        return result

    async def handle_retry(self, result: TaskResult, retry: int) -> None:
        if self.retry <= 0 or result.status:
            print(
                f"Task {self.task_id}: No need to retry, since the retry count is {self.retry} or task status is {result.status}"
            )
            if result.status:
                print(f"Task {self.task_id}: Completed successfully with result {result.result}")
            else:
                print(f"Task {self.task_id}: Failed with error: {result.error}")
            await self.event_bus.publish(result, EventType.TASK, self.task_id)
            return

        while retry > 0:
            retry -= 1
            print(f"Task {self.task_id}: Retrying... Remaining retries: {retry}")
            result = await self.run()
            if result.status:
                print(f"Task {self.task_id}: Retry completed successfully with result {result.result}")
                await self.event_bus.publish(result, EventType.TASK, self.task_id)
                return
            else:
                print(f"Task {self.task_id}: Retry failed with error: {result.error}")

        print(f"Task {self.task_id}: Failed after all retries. Max retries {self.retry}")
        await self.event_bus.publish(result, EventType.TASK, self.task_id)

    @abstractmethod
    async def run(self) -> TaskResult:
        pass


class OCRTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus[TaskResult], image: str,
                 dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.image = image

    async def run(self) -> TaskResult:
        print(f"OCRTask {self.task_id}: Processing image {self.image}")
        # Access dependencies if needed
        # For example:
        # yolo_result = self.dependency_results.get('super_task_id_yolo')

        await asyncio.sleep(2)  # Simulate OCR processing
        result_text = f"Extracted text from {self.image}"
        print(f"OCRTask {self.task_id}: {result_text}")
        return TaskResult(status=True, result=result_text)


class YOLOTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus[TaskResult], image: str, model: YOLO,
                 dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.image = image
        self.model = model

    async def run(self) -> TaskResult:
        print(f"YOLOTask {self.task_id}: Processing image {self.image}")
        # Access dependencies if needed
        # For example:
        screenshot_result = self.dependency_results.get(self.dependencies[0])
        print(f"YOLOTask {self.task_id}: Screenshot result: {screenshot_result.result}")

        await asyncio.sleep(2)  # Simulate YOLO processing
        # Placeholder for actual YOLO processing
        detected_objects = f"Detected objects in {self.image}"
        print(f"YOLOTask {self.task_id}: {detected_objects}")
        return TaskResult(status=True, result=detected_objects)


class ScreenshotTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus[TaskResult],
                 dependencies: Optional[List[str]] = None, retry: int = 1):
        super().__init__(task_id, event_bus, dependencies, retry=retry)

    async def run(self) -> TaskResult:
        print(f"ScreenshotTask {self.task_id}: Capturing screenshot")
        try:
            # await asyncio.sleep(2)  # Simulate screenshot capture
            # raise Exception("Failed to capture screenshot")
            # Simulate success or failure
            # For demonstration, let's assume it succeeds
            screenshot_result = "Screenshot captured"
            print(f"ScreenshotTask {self.task_id}: {screenshot_result}")
            return TaskResult(status=True, result=screenshot_result)
        except Exception as e:
            print(f"ScreenshotTask {self.task_id}: Failed with error: {e}")
            return TaskResult(status=False, result=None, error=str(e))


class SuperTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus[TaskResult], sub_tasks_info: List[SubTaskInfo],
                 dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.sub_tasks_info = sub_tasks_info
        self.sub_tasks: Dict[str, Task] = {}

    async def run(self) -> TaskResult:
        print(f"SuperTask {self.task_id}: Creating and scheduling sub-tasks.")

        # Create sub-tasks
        for sub_info in self.sub_tasks_info:
            sub_task_id = f"{self.task_id}_{sub_info.task_type.value}"
            task = TaskFactory.create_task(
                task_type=sub_info.task_type,
                task_id=sub_task_id,
                event_bus=self.event_bus,
                dependencies=[f"{self.task_id}_{dep}" for dep in sub_info.dependencies],
                **sub_info.parameters
            )
            self.sub_tasks[sub_task_id] = task
            asyncio.create_task(task.execute())
            print(f"SuperTask {self.task_id}: Scheduled sub-task '{sub_info.task_type.value}' with ID '{sub_task_id}'.")

        # Wait for all sub-tasks to complete
        results = {}
        failed = False
        for task_id, task in self.sub_tasks.items():
            try:
                result = await self.wait_for_event(task.task_id)
                results[task_id] = result
                if not result.status:
                    failed = True
            except Exception as e:
                failed = True
                print(f"SuperTask {self.task_id}: Sub-task '{task_id}' failed with error: {e}")

        if not failed:
            aggregated_result = {
                "sub_task_results": {k: v.result for k, v in results.items()}
            }
            print(f"SuperTask {self.task_id}: Aggregated result: {aggregated_result}")
            return TaskResult(status=True, result=aggregated_result)
        else:
            aggregated_error = "One or more sub-tasks failed."
            print(f"SuperTask {self.task_id}: Failed due to sub-task failures.")
            return TaskResult(
                status=False,
                error=aggregated_error,
                result={
                    "sub_task_results": {k: v.result for k, v in results.items()},
                }
            )


class TaskFactory:
    _model: Optional[YOLO] = None
    _event_bus: Optional[EventBus[TaskResult]] = None
    _lock = asyncio.Lock()

    @classmethod
    async def get_event_bus(cls) -> EventBus[TaskResult]:
        async with cls._lock:
            if not cls._event_bus:
                cls._event_bus = EventBus[TaskResult]()
                print("TaskFactory: EventBus initialized.")
            return cls._event_bus

    @classmethod
    async def get_yolo_model(cls) -> YOLO:
        async with cls._lock:
            if not cls._model:
                try:
                    print("TaskFactory: Initializing YOLO model...")
                    cls._model = YOLO(YOLO_MODEL_PATH)
                    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
                    cls._model.to(device)
                    print("TaskFactory: YOLO model initialized.")
                except Exception as e:
                    print(f"TaskFactory: Failed to initialize YOLO model. Error: {e}")
                    raise e
            return cls._model

    @classmethod
    def create_task(cls, task_type: TaskType, task_id: str, event_bus: EventBus[TaskResult],
                    dependencies: Optional[List[str]] = None, **kwargs) -> Task:
        if task_type == TaskType.OCR:
            image = kwargs.get('image', 'default_image.png')
            return OCRTask(
                task_id=task_id,
                event_bus=event_bus,
                image=image,
                dependencies=dependencies
            )
        elif task_type == TaskType.YOLO:
            image = kwargs.get('image', 'default_image.png')
            if not cls._model:
                raise ValueError("YOLO model is not initialized. Please initialize it before creating YOLO tasks.")
            return YOLOTask(
                task_id=task_id,
                event_bus=event_bus,
                image=image,
                model=cls._model,
                dependencies=dependencies
            )
        elif task_type == TaskType.SCREENSHOT:
            return ScreenshotTask(
                task_id=task_id,
                event_bus=event_bus,
                dependencies=dependencies
            )
        elif task_type == TaskType.SUPER_TASK:
            sub_tasks_info = kwargs["sub_tasks_info"]
            return SuperTask(
                task_id=task_id,
                event_bus=event_bus,
                sub_tasks_info=sub_tasks_info,
                dependencies=dependencies
            )
        else:
            raise ValueError(f"Unknown task type: {task_type}")


class GlobalState:
    def __init__(self):
        self.state = {
            "trigger_task": True,  # Example state variable
            "task_parameters": {
                "image": "default_image.png"
            }
        }
        self.lock = asyncio.Lock()

    async def get_state(self) -> Dict[str, Any]:
        async with self.lock:
            return self.state.copy()

    async def update_state(self, new_state: Dict[str, Any]):
        async with self.lock:
            self.state.update(new_state)


async def monitor_global_state(task_config: Any, global_state: GlobalState, event_bus: EventBus[TaskResult]):
    while True:
        state = await global_state.get_state()

        if state.get("trigger_task"):
            sub_tasks_info = [
                SubTaskInfo(
                    task_type=TaskType.SCREENSHOT,
                    parameters={},
                    dependencies=[]
                ),
                SubTaskInfo(
                    task_type=TaskType.YOLO,
                    parameters={},  # Example parameter
                    dependencies=['screenshot']
                ),
                SubTaskInfo(
                    task_type=TaskType.OCR,
                    parameters={},
                    dependencies=['yolo']
                )
            ]

            # Create SuperTask
            super_task_id = f"super_task_{uuid.uuid4()}"
            super_task = TaskFactory.create_task(
                task_type=TaskType.SUPER_TASK,
                task_id=super_task_id,
                event_bus=event_bus,
                sub_tasks_info=sub_tasks_info,
                dependencies=[]
            )
            print(f"Monitor: Triggering SuperTask {super_task_id} based on global state.")
            asyncio.create_task(super_task.execute())

            # Optionally reset the trigger to prevent continuous triggering
            await global_state.update_state({"trigger_task": False})

        await asyncio.sleep(2.0)


async def main():
    # Read the configuration for tasks
    try:
        with open(TASK_CONFIG_PATH, 'r') as task_config_file:
            task_config = json.load(task_config_file)
    except FileNotFoundError:
        print(f"Main: Task configuration file not found at {TASK_CONFIG_PATH}. Exiting.")
        return
    except json.JSONDecodeError as e:
        print(f"Main: Failed to parse task configuration. Error: {e}. Exiting.")
        return

    global_state = GlobalState()
    event_bus = await TaskFactory.get_event_bus()

    # Initialize YOLO model
    try:
        await TaskFactory.get_yolo_model()
    except Exception as e:
        print(f"Main: YOLO model initialization failed. Exiting. Error: {e}")
        return

    # Start monitoring global state
    monitor_task = asyncio.create_task(monitor_global_state(task_config, global_state, event_bus))

    # Optionally, handle graceful shutdown or run for a set duration
    try:
        await asyncio.gather(monitor_task)
    except asyncio.CancelledError:
        pass
    finally:
        print("Main: Shutting down...")


if __name__ == "__main__":
    asyncio.run(main())
