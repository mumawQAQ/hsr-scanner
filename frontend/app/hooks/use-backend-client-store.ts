import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';
import useRelicStore from '@/app/hooks/use-relic-store';

type UseBackendClientStore = {
  requirementFulfilled: boolean;
  setRequirementFulfilled: (fulfilled: boolean) => void;

  apiInitialized: boolean;

  backendPort: number | null;
  setBackendPort: (port: number) => void;
  ws: WebSocket | null;
  api: AxiosInstance | null;
};

const useBackendClientStore = create<UseBackendClientStore>(set => ({

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
    const ws = new WebSocket(`ws://localhost:${port}/ws`);
    ws.onopen = () => {
    };

    ws.onclose = () => {
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = event => {
      // parse the message
      const data = JSON.parse(event.data);

      if (data.type === 'error') {
        if (data.pipeline_type === 'SingleRelicAnalysisPipeline') {
          useRelicStore.setState({ relicError: data.error });
          useRelicStore.setState({ relicInfo: null });
        }
      } else if (data.type === 'progress') {
        console.log(data);
      } else if (data.type === 'result') {
        if (data.pipeline_type === 'SingleRelicAnalysisPipeline' && data.stage === 'ocr') {
          const relicData = data.data;
          console.log(relicData);
          useRelicStore.setState({ relicInfo: relicData });
          useRelicStore.setState({ relicError: null });
        } else if (data.pipeline_type === 'SingleRelicAnalysisPipeline' && data.stage === 'relic_analysis') {
          const relicScores = data.data;
          console.log(relicScores);
          useRelicStore.setState({ relicScores: relicScores });
        }
      }
    };

    set({ ws });
  },
  ws: null,
  api: null,
}));

export default useBackendClientStore;
