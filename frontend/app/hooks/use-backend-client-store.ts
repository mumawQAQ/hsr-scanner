import axios, { AxiosInstance } from 'axios';
import { create } from 'zustand';
import useRelicStore from '@/app/hooks/use-relic-store';
import { RelicSubStats } from '../../../src/type/types';

type UseBackendClientStore = {
  requirementFulfilled: boolean;
  setRequirementFulfilled: (fulfilled: boolean) => void;

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

    // initialize the websocket
    const ws = new WebSocket(`ws://localhost:${port}/relic-info`);
    ws.onopen = () => {};

    ws.onclose = () => {};

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = event => {
      // parse the message
      const data = JSON.parse(event.data);

      // check if the data is error
      if (data.type == 'error') {
        useRelicStore.setState({ relicError: data.message });
        useRelicStore.setState({ relicInfo: null });
      } else if (data.type == 'info') {
        const message = JSON.parse(data.message);
        const relicInfo = {
          title: {
            title: message.title.title,
            set_name: message.title.set_name,
          },
          main_stats: {
            name: message.main_stat.name,
            number: message.main_stat.number,
            level: message.main_stat.level,
            enhance_level: message.main_stat.enhance_level,
          },
          sub_stats: message.sub_stats.map((subStat: RelicSubStats) => ({
            name: subStat.name,
            number: subStat.number,
            score: subStat.score,
          })),
        };
        useRelicStore.setState({ relicInfo: relicInfo });
        useRelicStore.setState({ relicError: null });
      } else if (data.type == 'img') {
        const message = JSON.parse(data.message);
        const relicImage = {
          title_img: message.title_img,
          main_stat_img: message.main_stat_img,
          sub_stat_img: message.sub_stat_img,
        };
        useRelicStore.setState({ relicImage: relicImage });
      }
    };

    set({ ws });
  },
  ws: null,
  api: null,
}));

export default useBackendClientStore;
