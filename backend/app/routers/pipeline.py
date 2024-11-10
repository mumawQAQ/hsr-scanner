from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException

from app.core.managers.pipeline_manager import PipelineManager
from app.core.network_models.requests.pipeline_request import StartPipelineRequest, StopPipelineRequest
from app.core.network_models.responses.pipeline_response import StartPipelineResponse, ErrorResponse, \
    StopPipelineResponse, \
    ActivePipelinesResponse, StatusResponse
from app.core.pipeline_executer import PipelineExecutor
from app.life_span import get_pipeline_manager, get_pipeline_executor
from app.logging_config import logger

router = APIRouter()


@router.post("/start",
             response_model=StartPipelineResponse,
             responses={400: {"model": ErrorResponse}},
             status_code=HTTPStatus.CREATED)
async def start_pipeline(
        request: StartPipelineRequest,
        _pipeline_manager: PipelineManager = Depends(get_pipeline_manager),
        _pipeline_executor: PipelineExecutor = Depends(get_pipeline_executor)
):
    pipeline_name = request.pipeline_name
    initial_data = request.initial_data

    logger.info(f"Starting pipeline '{pipeline_name}' with initial data: {initial_data}")

    try:
        pipeline_class = _pipeline_manager.get_pipeline(pipeline_name)
    except ValueError as e:
        logger.error(f"Error starting pipeline: {e}")
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail=str(e))

    pipeline_id = _pipeline_executor.start_pipeline(pipeline_class, initial_data)

    response = StartPipelineResponse(
        message=f"Pipeline '{pipeline_name}' started.",
        pipeline_id=pipeline_id,
        pipeline_type=pipeline_name
    )
    return response


@router.post("/stop",
             response_model=StopPipelineResponse,
             responses={400: {"model": ErrorResponse}},
             status_code=HTTPStatus.OK)
async def stop_pipeline(
        request: StopPipelineRequest,
        _pipeline_executor: PipelineExecutor = Depends(get_pipeline_executor)
):
    pipeline_id = request.pipeline_id

    logger.info(f"Stopping pipeline '{pipeline_id}'")

    if pipeline_id not in _pipeline_executor.active_pipelines:
        error_msg = f"No active pipeline with ID '{pipeline_id}'."
        logger.error(error_msg)
        raise HTTPException(status_code=HTTPStatus.BAD_REQUEST, detail=error_msg)

    await _pipeline_executor.stop_pipeline(pipeline_id)

    response = StopPipelineResponse(
        message=f"Pipeline '{pipeline_id}' has been stopped.",
        pipeline_id=pipeline_id
    )
    return response


@router.get("/list", response_model=ActivePipelinesResponse)
async def list_active_pipelines(
        _pipeline_executor: PipelineExecutor = Depends(get_pipeline_executor)
):
    active_pipelines = _pipeline_executor.get_active_pipelines()
    response = ActivePipelinesResponse(
        pipelines=active_pipelines
    )
    return response


@router.get("/status/{pipeline_id}",
            response_model=StatusResponse,
            responses={404: {"model": ErrorResponse}},
            status_code=HTTPStatus.OK)
async def get_pipeline_status(
        pipeline_id: str,
        _pipeline_executor: PipelineExecutor = Depends(get_pipeline_executor)
):
    logger.info(f"Fetching status for pipeline '{pipeline_id}'")

    if pipeline_id in _pipeline_executor.active_pipelines:
        status_str = "running"
    else:
        status_str = "stopped"

    response = StatusResponse(
        pipeline_id=pipeline_id,
        status=status_str
    )
    return response
