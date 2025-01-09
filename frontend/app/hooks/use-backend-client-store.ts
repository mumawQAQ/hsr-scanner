import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';
import useRelicStore from '@/app/hooks/use-relic-store';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

type UseBackendClientStore = {
  requirementFulfilled: boolean;
  setRequirementFulfilled: (fulfilled: boolean) => void;

  apiInitialized: boolean;

  backendPort: number | null;
  setBackendPort: (port: number) => void;
  ws: Socket | null;
  api: AxiosInstance | null;

  singleRelicAnalysisId: string | null;
  autoRelicAnalysisId: string | null;

  startPipeline: (configName: string, metaData: Record<string, object | boolean | number>) => void;
  stopPipeline: () => void;
};

const useBackendClientStore = create<UseBackendClientStore>((set, get) => ({
  singleRelicAnalysisId: null,
  autoRelicAnalysisId: null,

  startPipeline: (configName, metaData) => {
    if (!get().ws) {
      return;
    }
    get().ws?.emit('start_pipeline', { config_name: configName, meta_data: metaData });
  },

  stopPipeline: () => {
    if (!get().ws) {
      return;
    }
    get().ws?.emit('stop_pipeline', {});
  },

  requirementFulfilled: false,
  setRequirementFulfilled: fulfilled => {
    set({ requirementFulfilled: fulfilled });
  },
  apiInitialized: false,

  backendPort: null,
  setBackendPort: port => {
    if (useBackendClientStore.getState().backendPort !== null) {
      console.log('Backend port already set:', port);
      return;
    }
    console.log(`Visited http://localhost:${port}/docs to check the API documentation`);
    set({ backendPort: port });
    // init the axios instance
    const api = axios.create({
      baseURL: `http://localhost:${port}`,
    });

    set({ api });
    set({ apiInitialized: true });


    // initialize the websocket
    const socketClient = io(`http://localhost:${port}`);

    socketClient.on('pipeline_result', (data) => {
      if (data.stage === 'ocr_stage') {
        const relicData = data.data;
        console.log(relicData);
        useRelicStore.setState({ relicInfo: relicData });
      } else if (data.stage === 'relic_analysis_stage') {
        const relicScores = data.data;
        console.log(relicScores);
        useRelicStore.setState({ relicScores: relicScores });
      }
    });

    socketClient.on('pipeline_error', (data) => {
      toast.error(data.error);
    });

    socketClient.on('pipeline_started', (data) => {
      if (data.pipeline_type === 'SingleRelicAnalysisPipeline') {
        set({ singleRelicAnalysisId: data.pipeline_id });
      } else if (data.pipeline_type === 'AutoRelicAnalysisPipeline') {
        set({ autoRelicAnalysisId: data.pipeline_id });
      }
    });

    socketClient.on('pipeline_stopped', (data) => {
      if (data.pipeline_type === 'SingleRelicAnalysisPipeline') {
        set({ singleRelicAnalysisId: null });
      } else if (data.pipeline_type === 'AutoRelicAnalysisPipeline') {
        set({ autoRelicAnalysisId: null });
      }
    });

    set({ ws: socketClient });
  },
  ws: null,
  api: null,
}));

export default useBackendClientStore;
