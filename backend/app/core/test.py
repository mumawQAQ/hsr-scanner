import asyncio
import time
import uuid
from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional, List, Any, Dict, Callable

import torch
from pydantic import BaseModel
from ultralytics import YOLO

from app.constant import YOLO_MODEL_PATH


class TaskType(Enum):
    SUPER_TASK = 'super_task'
    SCREENSHOT = 'screenshot'
    OCR = 'ocr'
    YOLO = 'yolo'


class SubTaskInfo(BaseModel):
    name: str  # Unique name for the sub-task within the SuperTask
    task_type: TaskType
    parameters: Dict[str, Any]
    dependencies: List[str]  # List of sub-task names this sub-task depends on


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[Any], Any]]] = {}
        self._lock = asyncio.Lock()

    async def publish(self, event_type: str, data: Any = None):
        async with self._lock:
            subscribers = self._subscribers.get(event_type, []).copy()
        for callback in subscribers:
            asyncio.create_task(callback(data))

    async def subscribe(self, event_type: str, callback: Callable[[Any], Any]):
        async with self._lock:
            if event_type not in self._subscribers:
                self._subscribers[event_type] = []
            self._subscribers[event_type].append(callback)

    async def unsubscribe(self, event_type: str, callback: Callable[[Any], Any]):
        async with self._lock:
            if event_type in self._subscribers:
                self._subscribers[event_type].remove(callback)
                if not self._subscribers[event_type]:
                    del self._subscribers[event_type]


class Task(ABC):
    def __init__(
            self,
            task_id: str,
            event_bus: EventBus,
            dependencies: Optional[List[str]] = None,
            retries: int = 3
    ):
        self.id = task_id
        self.event_bus = event_bus
        self.dependencies = dependencies or []
        self.retries = retries

    async def execute(self):
        await self.wait_for_dependencies()
        await self.run()

    async def wait_for_dependencies(self):
        if self.dependencies:
            print(f"Task {self.id}: Waiting for dependencies: {self.dependencies}")
            dependency_events = [
                f"task_completed_{dep_id}" for dep_id in self.dependencies
            ]
            await asyncio.gather(
                *[self.wait_for_event(event) for event in dependency_events]
            )

    async def wait_for_event(self, event_type: str):
        event = asyncio.Event()

        async def callback(data):
            nonlocal received_data
            received_data = data
            event.set()

        received_data = None
        await self.event_bus.subscribe(event_type, callback)
        await event.wait()
        await self.event_bus.unsubscribe(event_type, callback)
        return received_data

    async def handle_retry(self, error):
        if self.retries > 0:
            self.retries -= 1
            print(f"Task {self.id}: Retrying... Remaining retries: {self.retries}")
            await self.run()
        else:
            print(f"Task {self.id}: Failed after retries. Error: {error}")
            await self.event_bus.publish(f"task_failed_{self.id}", str(error))

    @abstractmethod
    async def run(self):
        pass


class OCRTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus, image: str, dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.image = image

    async def run(self):
        try:
            print(f"OCRTask {self.id}: Processing image {self.image}")
            await asyncio.sleep(2)  # Simulate OCR processing
            result = f"Extracted text from {self.image}"
            print(f"OCRTask {self.id}: {result}")
            await self.event_bus.publish(f"task_completed_{self.id}", result)
        except Exception as e:
            print(f"OCRTask {self.id}: Error - {e}")
            await self.handle_retry(e)


class YOLOTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus, image: str, model: YOLO,
                 dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.image = image
        self.model = model

    async def run(self):
        try:
            print(f"YOLOTask {self.id}: Processing image {self.image}")
            await asyncio.sleep(2)  # Simulate YOLO processing
            # Placeholder for actual YOLO processing
            result = f"Detected objects in {self.image}"
            print(f"YOLOTask {self.id}: {result}")
            await self.event_bus.publish(f"task_completed_{self.id}", result)
        except Exception as e:
            print(f"YOLOTask {self.id}: Error - {e}")
            await self.handle_retry(e)


class ScreenshotTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus, dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)

    async def run(self):
        try:
            print(f"ScreenshotTask {self.id}: Capturing screenshot")
            await asyncio.sleep(2)  # Simulate screenshot capture
            result = "Screenshot captured"
            print(f"ScreenshotTask {self.id}: {result}")
            await self.event_bus.publish(f"task_completed_{self.id}", result)
        except Exception as e:
            print(f"ScreenshotTask {self.id}: Error - {e}")
            await self.handle_retry(e)


class SuperTask(Task):
    def __init__(self, task_id: str, event_bus: EventBus, sub_tasks_info: List[SubTaskInfo],
                 dependencies: Optional[List[str]] = None):
        super().__init__(task_id, event_bus, dependencies)
        self.sub_tasks_info = sub_tasks_info
        self.sub_tasks: Dict[str, Task] = {}

    async def run(self):
        start = time.time()
        try:
            print(f"SuperTask {self.id}: Creating and scheduling sub-tasks.")
            # Create sub-tasks
            for sub_info in self.sub_tasks_info:
                task_id = f"{self.id}_{sub_info.name}"
                task = TaskFactory.create_task(
                    task_type=sub_info.task_type,
                    task_id=task_id,
                    event_bus=self.event_bus,
                    dependencies=[f"{self.id}_{dep}" for dep in sub_info.dependencies],
                    **sub_info.parameters
                )
                self.sub_tasks[sub_info.name] = task
                asyncio.create_task(task.execute())
                print(f"SuperTask {self.id}: Scheduled sub-task '{sub_info.name}' with ID '{task_id}'.")

            # Wait for all sub-tasks to complete
            results = {}
            failed = False
            for name, task in self.sub_tasks.items():
                try:
                    result = await self.wait_for_task_result(task.id)
                    results[name] = result
                except Exception as e:
                    failed = True
                    print(f"SuperTask {self.id}: Sub-task '{name}' failed with error: {e}")

            if not failed:
                aggregated_result = {
                    "super_task_id": self.id,
                    "sub_tasks_results": results
                }
                print(f"SuperTask {self.id}: Aggregated result: {aggregated_result}")
                await self.event_bus.publish(f"task_completed_{self.id}", aggregated_result)
            else:
                print(f"SuperTask {self.id}: Failed due to sub-task failures.")
                await self.event_bus.publish(f"task_failed_{self.id}", "One or more sub-tasks failed.")

            print(f"SuperTask {self.id}: Completed in {time.time() - start:.2f} seconds.")
        except Exception as e:
            print(f"SuperTask {self.id}: Error - {e}")
            await self.handle_retry(e)

    async def wait_for_task_result(self, task_id: str):
        event = asyncio.Event()
        result = None
        success = False

        async def completed_callback(data):
            nonlocal result, success
            result = data
            success = True
            event.set()

        async def failed_callback(data):
            nonlocal result, success
            result = data
            success = False
            event.set()

        await self.event_bus.subscribe(f"task_completed_{task_id}", completed_callback)
        await self.event_bus.subscribe(f"task_failed_{task_id}", failed_callback)

        await event.wait()

        await self.event_bus.unsubscribe(f"task_completed_{task_id}", completed_callback)
        await self.event_bus.unsubscribe(f"task_failed_{task_id}", failed_callback)

        if success:
            return result
        else:
            raise Exception(result)


class TaskFactory:
    _model: Optional[YOLO] = None
    _event_bus: Optional[EventBus] = None
    _lock = asyncio.Lock()

    @classmethod
    async def get_event_bus(cls) -> EventBus:
        async with cls._lock:
            if not cls._event_bus:
                cls._event_bus = EventBus()
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
    def create_task(cls, task_type: TaskType, task_id: str, event_bus: EventBus,
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
            model = cls._model  # Assume model is already initialized
            return YOLOTask(
                task_id=task_id,
                event_bus=event_bus,
                image=image,
                model=model,
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


async def monitor_global_state(global_state: GlobalState, event_bus: EventBus):
    while True:
        state = await global_state.get_state()
        if state.get("trigger_task"):
            # Define sub-tasks with unique names and dependencies by name
            sub_tasks_info = [
                SubTaskInfo(
                    name='screenshot',
                    task_type=TaskType.SCREENSHOT,
                    parameters={},  # ScreenshotTask might not need 'image'
                    dependencies=[]
                ),
                SubTaskInfo(
                    name='yolo',
                    task_type=TaskType.YOLO,
                    parameters={'image': 'screenshot.png'},
                    dependencies=['screenshot']
                ),
                SubTaskInfo(
                    name='ocr',
                    task_type=TaskType.OCR,
                    parameters={'image': 'screenshot.png'},
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

            # Reset the trigger to prevent re-triggering
            await global_state.update_state({"trigger_task": False})
        await asyncio.sleep(2.0)


async def main():
    global_state = GlobalState()
    event_bus = await TaskFactory.get_event_bus()

    # Initialize YOLO model
    try:
        await TaskFactory.get_yolo_model()
    except Exception as e:
        print(f"Main: YOLO model initialization failed. Exiting. Error: {e}")
        return

    # Start monitoring global state
    monitor_task = asyncio.create_task(monitor_global_state(global_state, event_bus))

    # Example: Trigger SuperTask after some time
    async def trigger_task():
        await asyncio.sleep(1)
        await global_state.update_state({"trigger_task": True})

    trigger_task_coro = asyncio.create_task(trigger_task())

    # Run the system indefinitely or for a set duration
    try:
        await asyncio.gather(monitor_task, trigger_task_coro)
    except asyncio.CancelledError:
        pass
    finally:
        print("Main: Shutting down...")


if __name__ == "__main__":
    asyncio.run(main())
