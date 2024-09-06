import axios from 'axios';
import { create } from 'zustand';
import useRelicStore from '@/app/hooks/use-relic-store';
import { RelicSubStats } from '../../../src/type/types';

type UseBackendClientStore = {
  requirementFulfilled: boolean;
  setRequirementFulfilled: (fulfilled: boolean) => void;

  backendPort: number | null;
  setBackendPort: (port: number) => void;
  ws: WebSocket | null;
  patch: (path: string, data: string) => Promise<void>;
};

const useBackendClientStore = create<UseBackendClientStore>((set, get) => ({
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
    set({ backendPort: port });
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
            setName: message.title.set_name,
          },
          mainStats: {
            name: message.main_stat.name,
            number: message.main_stat.number,
            level: message.main_stat.level,
            enhanceLevel: message.main_stat.enhance_level,
          },
          subStats: message.sub_stats.map((subStat: RelicSubStats) => ({
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
          titleImage: message.title_img,
          mainStatImage: message.main_stat_img,
          subStatImages: message.sub_stat_img,
        };
        useRelicStore.setState({ relicImage: relicImage });
      }
    };

    set({ ws });
  },
  ws: null,

  patch: async (path, data) => {
    await axios.patch(`http://localhost:${get().backendPort}/${path}/${data}`);
  },
}));

export default useBackendClientStore;
