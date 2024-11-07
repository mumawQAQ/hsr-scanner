from __future__ import annotations

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import field
from enum import Enum
from typing import Dict, List, Any, Optional, Protocol, Type, TypeVar
from uuid import uuid4

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# ---- WebsocketManager Implementation ----
class WebsocketManager:
    """Manages a single WebSocket connection, allowing messages to be sent to the client."""

    def __init__(self):
        self.connection: Optional[WebSocket] = None

    async def register(self, websocket: WebSocket):
        """Register a WebSocket connection."""
        self.connection = websocket
        logger.info("WebSocket connection established.")

    async def unregister(self):
        """Unregister the WebSocket connection."""
        if self.connection:
            logger.info("WebSocket connection closed.")
        self.connection = None

    async def send_message(self, message: Dict[str, Any]):
        """Send a message to the connected WebSocket."""
        if self.connection:
            try:
                await self.connection.send_json(message)
                logger.debug(f"Sent message to client: {message}")
            except Exception as e:
                logger.error(f"Error sending message to WebSocket: {e}")
        else:
            logger.warning("No active WebSocket connection to send messages.")


# ---- Core Pipeline Protocol and Base Classes ----
from typing import runtime_checkable


@runtime_checkable
class PipelineStageProtocol(Protocol):
    """Protocol defining what a pipeline stage must implement"""

    @abstractmethod
    async def process(self, context: PipelineContext) -> StageResult:
        pass

    @abstractmethod
    def get_stage_name(self) -> str:
        pass


@runtime_checkable
class PipelineProtocol(Protocol):
    """Protocol defining what a pipeline must implement"""

    @classmethod
    @abstractmethod
    def get_stages(cls) -> List[Type[PipelineStageProtocol]]:
        pass

    @classmethod
    @abstractmethod
    def get_pipeline_name(cls) -> str:
        pass


# ---- Base Models ----
class StageResult(BaseModel):
    """Base result model for all stages"""
    success: bool
    data: Any
    error: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class PipelineContext(BaseModel):
    """Base context holding pipeline execution data"""
    pipeline_id: str
    pipeline_type: str
    data: Dict[str, Any] = field(default_factory=dict)
    metadata: Dict[str, Any] = field(default_factory=dict)


# ---- Generic Pipeline Stage Base ----
class BasePipelineStage(ABC, PipelineStageProtocol):

    @abstractmethod
    def get_stage_name(self) -> str:
        pass

    @abstractmethod
    async def process(self, context: PipelineContext) -> StageResult:
        pass

    async def send_progress(self, context: PipelineContext, message: str):
        """Send progress message via WebSocket."""
        await self.websocket_manager.send_message({
            "type": "progress",
            "stage": self.get_stage_name(),
            "message": message,
            "pipeline_id": context.pipeline_id,
            "pipeline_type": context.pipeline_type
        })


# ---- Game Recognition Pipeline Stages ----
class GameRecognitionStage(str, Enum):
    SCREENSHOT = "screenshot"
    SCENE_DETECTION = "scene_detection"
    UI_ELEMENT_DETECTION = "ui_element_detection"
    OCR = "ocr"
    GAME_STATE_ANALYSIS = "game_state_analysis"


class GameScreenshotStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.SCREENSHOT.value

    async def take_screenshot(self) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "screenshot_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Taking game screenshot...")
        try:
            screenshot_data = await self.take_screenshot()
            return StageResult(
                success=True,
                data=screenshot_data,
                metadata={"resolution": "1920x1080"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class GameSceneDetectionStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.SCENE_DETECTION.value

    async def detect_scene(self, screenshot: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "scene_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Detecting game scene...")
        try:
            screenshot = context.data.get(GameRecognitionStage.SCREENSHOT.value)
            if not screenshot:
                raise ValueError("Screenshot data not found.")
            scene_data = await self.detect_scene(screenshot)
            return StageResult(
                success=True,
                data=scene_data,
                metadata={"scene_type": "battle"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class GameUIElementDetectionStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.UI_ELEMENT_DETECTION.value

    async def detect_ui_elements(self, scene_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "ui_elements_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Detecting UI elements...")
        try:
            scene_data = context.data.get(GameRecognitionStage.SCENE_DETECTION.value)
            if not scene_data:
                raise ValueError("Scene data not found.")
            ui_elements = await self.detect_ui_elements(scene_data)
            return StageResult(
                success=True,
                data=ui_elements,
                metadata={"ui_elements_found": 5}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class GameOCRStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.OCR.value

    async def perform_ocr(self, ui_elements: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "ocr_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Performing OCR on UI elements...")
        try:
            ui_elements = context.data.get(GameRecognitionStage.UI_ELEMENT_DETECTION.value)
            if not ui_elements:
                raise ValueError("UI elements data not found.")
            ocr_data = await self.perform_ocr(ui_elements)
            return StageResult(
                success=True,
                data=ocr_data,
                metadata={"text_detected": "Score: 1500"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class GameStateAnalysisStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return GameRecognitionStage.GAME_STATE_ANALYSIS.value

    async def analyze_game_state(self, ocr_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "game_state_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Analyzing game state...")
        try:
            ocr_data = context.data.get(GameRecognitionStage.OCR.value)
            if not ocr_data:
                raise ValueError("OCR data not found.")
            game_state = await self.analyze_game_state(ocr_data)
            return StageResult(
                success=True,
                data=game_state,
                metadata={"state": "active"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


# ---- Document Processing Pipeline Stages ----
class DocumentProcessingStage(str, Enum):
    CAPTURE = "capture"
    PREPROCESSING = "preprocessing"
    LAYOUT_ANALYSIS = "layout_analysis"
    OCR = "ocr"
    DATA_EXTRACTION = "data_extraction"


class DocumentCaptureStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return DocumentProcessingStage.CAPTURE.value

    async def capture_document(self) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "captured_document_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Capturing document...")
        try:
            document_data = await self.capture_document()
            return StageResult(
                success=True,
                data=document_data,
                metadata={"resolution": "300dpi"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class DocumentPreprocessingStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return DocumentProcessingStage.PREPROCESSING.value

    async def preprocess_document(self, document_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "preprocessed_document_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Preprocessing document...")
        try:
            document_data = context.data.get(DocumentProcessingStage.CAPTURE.value)
            if not document_data:
                raise ValueError("Captured document data not found.")
            preprocessed_data = await self.preprocess_document(document_data)
            return StageResult(
                success=True,
                data=preprocessed_data,
                metadata={"preprocessing": "grayscale"}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class LayoutAnalysisStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return DocumentProcessingStage.LAYOUT_ANALYSIS.value

    async def analyze_layout(self, preprocessed_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "layout_analysis_data"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Analyzing document layout...")
        try:
            preprocessed_data = context.data.get(DocumentProcessingStage.PREPROCESSING.value)
            if not preprocessed_data:
                raise ValueError("Preprocessed document data not found.")
            layout_data = await self.analyze_layout(preprocessed_data)
            return StageResult(
                success=True,
                data=layout_data,
                metadata={"layout_elements": 10}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class DocumentOCRStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return DocumentProcessingStage.OCR.value

    async def perform_ocr(self, layout_data: str) -> str:
        await asyncio.sleep(1)  # Simulate processing time
        return "ocr_extracted_text"

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Performing OCR on document...")
        try:
            layout_data = context.data.get(DocumentProcessingStage.LAYOUT_ANALYSIS.value)
            if not layout_data:
                raise ValueError("Layout analysis data not found.")
            ocr_text = await self.perform_ocr(layout_data)
            return StageResult(
                success=True,
                data=ocr_text,
                metadata={"words_detected": 500}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


class DataExtractionStage(BasePipelineStage):
    def get_stage_name(self) -> str:
        return DocumentProcessingStage.DATA_EXTRACTION.value

    async def extract_data(self, ocr_text: str) -> Dict[str, Any]:
        await asyncio.sleep(1)  # Simulate processing time
        return {"invoice_number": "INV-12345", "amount": "$2500"}

    async def process(self, context: PipelineContext) -> StageResult:
        await self.send_progress(context, "Extracting data from document...")
        try:
            ocr_text = context.data.get(DocumentProcessingStage.OCR.value)
            if not ocr_text:
                raise ValueError("OCR text not found.")
            extracted_data = await self.extract_data(ocr_text)
            return StageResult(
                success=True,
                data=extracted_data,
                metadata={"fields_extracted": len(extracted_data)}
            )
        except Exception as e:
            logger.error(f"Error in {self.get_stage_name()}: {e}")
            return StageResult(success=False, data=None, error=str(e))


# ---- Pipeline Definitions ----
class GameRecognitionPipeline(PipelineProtocol):
    """Pipeline for game state recognition"""

    @classmethod
    def get_stages(cls) -> List[Type[PipelineStageProtocol]]:
        return [
            GameScreenshotStage,
            GameSceneDetectionStage,
            GameUIElementDetectionStage,
            GameOCRStage,
            GameStateAnalysisStage
        ]

    @classmethod
    def get_pipeline_name(cls) -> str:
        return "game_recognition"


class DocumentProcessingPipeline(PipelineProtocol):
    """Pipeline for document processing"""

    @classmethod
    def get_stages(cls) -> List[Type[PipelineStageProtocol]]:
        return [
            DocumentCaptureStage,
            DocumentPreprocessingStage,
            LayoutAnalysisStage,
            DocumentOCRStage,
            DataExtractionStage
        ]

    @classmethod
    def get_pipeline_name(cls) -> str:
        return "document_processing"


# ---- Pipeline Registry ----
T = TypeVar('T', bound=PipelineProtocol)


class PipelineRegistry:
    """Registry for managing available pipeline types"""

    def __init__(self):
        self._pipelines: Dict[str, Type[T]] = {}

    def register_pipeline(self, pipeline_class: Type[T]) -> None:
        """Register a new pipeline type"""
        if not issubclass(pipeline_class, PipelineProtocol):
            raise TypeError(f"{pipeline_class.__name__} does not implement PipelineProtocol.")
        self._pipelines[pipeline_class.get_pipeline_name()] = pipeline_class
        logger.info(f"Registered pipeline: {pipeline_class.get_pipeline_name()}")

    def get_pipeline(self, pipeline_name: str) -> Type[T]:
        """Get pipeline class by name"""
        if pipeline_name not in self._pipelines:
            raise ValueError(f"Pipeline '{pipeline_name}' not found")
        return self._pipelines[pipeline_name]

    def get_available_pipelines(self) -> List[str]:
        """Get list of available pipeline names"""
        return list(self._pipelines.keys())


# ---- Pipeline Factory ----
class PipelineFactory:
    """Factory for creating pipeline instances"""

    def __init__(self, _websocket_manager: WebsocketManager):
        self._websocket_manager = _websocket_manager

    def create_pipeline_stages(self, pipeline_type: Type[T]) -> List[PipelineStageProtocol]:
        """Create instances of all stages for a given pipeline type"""
        stages = pipeline_type.get_stages()
        # Ensure all stages conform to PipelineStageProtocol
        for stage_cls in stages:
            if not issubclass(stage_cls, PipelineStageProtocol):
                raise TypeError(f"{stage_cls.__name__} does not implement PipelineStageProtocol.")
        return [
            stage_class(self._websocket_manager)
            for stage_class in pipeline_type.get_stages()
        ]


# ---- Pipeline Executor ----
class PipelineExecutor:
    """Handles the execution of pipeline stages"""

    def __init__(self, _websocket_manager: WebsocketManager):
        self.websocket_manager = _websocket_manager
        self.pipeline_factory = PipelineFactory(websocket_manager)
        self.active_pipelines: Dict[str, Dict[str, Any]] = {}

    async def execute_pipeline(
            self,
            pipeline_type: Type[T],
            context: PipelineContext,
            stop_event: asyncio.Event
    ) -> None:
        """Execute a pipeline repeatedly until stop_event is set"""

        stages = self.pipeline_factory.create_pipeline_stages(pipeline_type)

        try:
            while not stop_event.is_set():
                for stage in stages:
                    if stop_event.is_set():
                        logger.info(f"Stop event set. Exiting pipeline {context.pipeline_id}.")
                        break
                    # Process stage
                    result = await stage.process(context)

                    # Handle stage result
                    if not result.success:
                        await self.websocket_manager.send_message({
                            "type": "error",
                            "stage": stage.get_stage_name(),
                            "error": result.error,
                            "pipeline_id": context.pipeline_id,
                            "pipeline_type": context.pipeline_type
                        })
                        logger.error(f"Pipeline {context.pipeline_id} failed at stage {stage.get_stage_name()}.")
                        stop_event.set()
                        break

                    # Update context with stage results
                    context.data[stage.get_stage_name()] = result.data
                    context.metadata.update(result.metadata)

                    # Broadcast stage completion
                    await self.websocket_manager.send_message({
                        "type": "result",
                        "stage": stage.get_stage_name(),
                        "data": result.data,
                        "pipeline_id": context.pipeline_id,
                        "pipeline_type": context.pipeline_type
                    })

                    logger.info(f"Pipeline {context.pipeline_id} completed stage {stage.get_stage_name()}.")

                # Optional: Add a delay between iterations to prevent tight looping
                await asyncio.sleep(1)  # Adjust as needed

        except asyncio.CancelledError:
            # Handle pipeline cancellation
            await self.websocket_manager.send_message({
                "type": "stopped",
                "message": "Pipeline execution has been stopped by the client.",
                "pipeline_id": context.pipeline_id,
                "pipeline_type": context.pipeline_type
            })
            logger.info(f"Pipeline {context.pipeline_id} has been cancelled.")
            raise

        except Exception as e:
            # Handle unexpected exceptions
            await self.websocket_manager.send_message({
                "type": "error",
                "message": f"Unexpected error: {str(e)}",
                "pipeline_id": context.pipeline_id,
                "pipeline_type": context.pipeline_type
            })
            logger.error(f"Unexpected error in pipeline {context.pipeline_id}: {e}")

    def start_pipeline(
            self,
            pipeline_type: Type[T],
            initial_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """Start a pipeline and return its ID"""
        pipeline_id = str(uuid4())

        context = PipelineContext(
            pipeline_id=pipeline_id,
            pipeline_type=pipeline_type.get_pipeline_name(),
            data=initial_data or {}
        )

        stop_event = asyncio.Event()

        task = asyncio.create_task(self.execute_pipeline(pipeline_type, context, stop_event))
        self.active_pipelines[pipeline_id] = {"task": task, "stop_event": stop_event,
                                              "pipeline_type": pipeline_type.get_pipeline_name()}

        logger.info(f"Started pipeline {pipeline_id} of type {pipeline_type.get_pipeline_name()}.")
        return pipeline_id

    async def stop_pipeline(self, pipeline_id: str):
        """Stop a running pipeline by its ID"""
        pipeline = self.active_pipelines.get(pipeline_id)
        if pipeline:
            pipeline["stop_event"].set()
            task: asyncio.Task = pipeline["task"]
            try:
                await task
            except asyncio.CancelledError:
                logger.info(f"Pipeline {pipeline_id} has been cancelled.")
            finally:
                del self.active_pipelines[pipeline_id]
                logger.info(f"Pipeline {pipeline_id} removed from active pipelines.")

    async def stop_all_pipelines(self):
        """Stop all running pipelines"""
        pipeline_ids = list(self.active_pipelines.keys())
        for pipeline_id in pipeline_ids:
            await self.stop_pipeline(pipeline_id)

    def get_active_pipelines(self) -> List[Dict[str, Any]]:
        """Return a list of active pipelines with their details"""
        active = []
        for pid, info in self.active_pipelines.items():
            active.append({
                "pipeline_id": pid,
                "pipeline_type": info.get("pipeline_type", "Unknown"),
                "status": "running"
            })
        return active


# ---- FastAPI Application Setup ----
app = FastAPI()
websocket_manager = WebsocketManager()
pipeline_registry = PipelineRegistry()
pipeline_executor = PipelineExecutor(websocket_manager)

# Register available pipelines
pipeline_registry.register_pipeline(GameRecognitionPipeline)
pipeline_registry.register_pipeline(DocumentProcessingPipeline)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket_manager.register(websocket)

    try:
        while True:
            message = await websocket.receive_text()
            logger.info(f"Received message from client: {message}")

            # Parse message (assuming JSON format)
            import json
            try:
                data = json.loads(message)
            except json.JSONDecodeError:
                await websocket_manager.send_message({
                    "type": "error",
                    "message": "Invalid JSON format."
                })
                continue

            command = data.get("command")

            if not command:
                await websocket_manager.send_message({
                    "type": "error",
                    "message": "No command provided."
                })
                continue

            if command == "start":
                # Start a new pipeline
                pipeline_name = data.get("pipeline_name")
                initial_data = data.get("initial_data", {})
                if not pipeline_name:
                    await websocket_manager.send_message({
                        "type": "error",
                        "message": "No pipeline_name provided for start command."
                    })
                    continue

                try:
                    pipeline_class = pipeline_registry.get_pipeline(pipeline_name)
                except ValueError as e:
                    await websocket_manager.send_message({
                        "type": "error",
                        "message": str(e)
                    })
                    continue

                pipeline_id = pipeline_executor.start_pipeline(pipeline_class, initial_data)

                await websocket_manager.send_message({
                    "type": "started",
                    "message": f"Pipeline '{pipeline_name}' started.",
                    "pipeline_id": pipeline_id,
                    "pipeline_type": pipeline_name
                })

            elif command == "stop":
                # Stop a pipeline
                pipeline_id = data.get("pipeline_id")
                if not pipeline_id:
                    await websocket_manager.send_message({
                        "type": "error",
                        "message": "No pipeline_id provided for stop command."
                    })
                    continue

                if pipeline_id not in pipeline_executor.active_pipelines:
                    await websocket_manager.send_message({
                        "type": "error",
                        "message": f"No active pipeline with ID '{pipeline_id}'."
                    })
                    continue

                await pipeline_executor.stop_pipeline(pipeline_id)

                await websocket_manager.send_message({
                    "type": "stopped",
                    "message": f"Pipeline '{pipeline_id}' has been stopped.",
                    "pipeline_id": pipeline_id
                })

            elif command == "list":
                # List all active pipelines
                active_pipelines = pipeline_executor.get_active_pipelines()
                await websocket_manager.send_message({
                    "type": "active_pipelines",
                    "pipelines": active_pipelines
                })

            elif command == "status":
                # Get status of a specific pipeline
                pipeline_id = data.get("pipeline_id")
                if not pipeline_id:
                    await websocket_manager.send_message({
                        "type": "error",
                        "message": "No pipeline_id provided for status command."
                    })
                    continue

                if pipeline_id in pipeline_executor.active_pipelines:
                    status = "running"
                else:
                    status = "stopped"

                await websocket_manager.send_message({
                    "type": "status",
                    "pipeline_id": pipeline_id,
                    "status": status
                })

            else:
                await websocket_manager.send_message({
                    "type": "error",
                    "message": f"Unknown command: {command}"
                })

    except WebSocketDisconnect:
        logger.info("WebSocket connection disconnected.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        await websocket_manager.send_message({
            "type": "error",
            "message": f"Unexpected error: {str(e)}"
        })
    finally:
        # Stop all pipelines associated with this connection if necessary
        await websocket_manager.unregister()


@app.get("/pipelines")
async def list_pipelines():
    """Endpoint to list available pipelines."""
    return {"available_pipelines": pipeline_registry.get_available_pipelines()}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
