import relicStore from '@/hooks/use-relic-store.ts';

const getRelicRatingInfo = async (relicTitle: string, relicMainStat: string) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);

  // make sure the relicRatingInfo is not undefined
  if (!relicRatingInfo) {
    return null;
  }

  // get the valuable sub stats and should lock
  const relicRatingDetail = relicRatingInfo[relicMainStat];

  // make sure the relicRatingDetail is not undefined
  if (!relicRatingDetail) {
    return null;
  }
  return {
    valuableSub: relicRatingDetail['valuableSub'],
    shouldLock: relicRatingDetail['shouldLock'],
  };
};

/**
 * Check if the relic has already set as valuable main stat, if not, set it as valuable main stat
 * @param relicTitle the relic title
 * @param relicMainStat the relic main stat
 */
const checkAndSetRelicRatingValuableMain = async (relicTitle: string, relicMainStat: string) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
  if (!relicRatingInfo) {
    return {
      success: false,
      message: '无法找到当前遗器，请向Github提交issue',
    };
  }

  if (!relicRatingInfo[relicMainStat]) {
    relicRatingInfo[relicMainStat] = {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    };

    relicStore.setState({
      relicRatingInfo: {
        valuableSub: [],
        shouldLock: {
          contain: '',
          include: {},
        },
      },
    });

    await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);
  }

  return {
    success: true,
    message: '成功添加有效主属性',
  };
};

const addRelicRatingValuableMain = async (relicTitle: string, relicMainStat: string) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
  if (!relicRatingInfo) {
    return {
      success: false,
      message: '无法找到当前遗器，请向Github提交issue',
    };
  }

  relicRatingInfo[relicMainStat] = {
    valuableSub: [],
    shouldLock: {
      contain: '',
      include: {},
    },
  };

  await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

  // update the relicStore
  relicStore.setState({
    relicRatingInfo: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  });

  return {
    success: true,
    message: '成功添加有效主属性',
  };
};

const removeRelicRatingValuableMain = async (relicTitle: string, relicMainStat: string) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
  if (!relicRatingInfo) {
    return {
      success: false,
      message: '无法找到当前遗器，请向Github提交issue',
    };
  }

  delete relicRatingInfo[relicMainStat];
  await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

  // update the relicStore
  relicStore.setState({
    relicRatingInfo: {
      valuableSub: [],
      shouldLock: {
        contain: '',
        include: {},
      },
    },
  });

  return {
    success: true,
    message: '成功删除有效主属性',
  };
};

const updateRelicRatingValuableSub = async (relicTitle: string, relicMainStat: string, valuableSub: string[]) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
  if (!relicRatingInfo) {
    return {
      success: false,
      message: '无法找到当前遗器，请向Github提交issue',
    };
  }

  if (!relicRatingInfo[relicMainStat]) {
    return {
      success: false,
      message: '当前遗器的主属性无法找到，请先添加主属性为有效属性',
    };
  }
  // update the valuableSub
  relicRatingInfo[relicMainStat]['valuableSub'] = valuableSub;

  // save the updated relicRatingInfo
  await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

  // update the relicStore
  relicStore.setState({
    relicRatingInfo: relicRatingInfo[relicMainStat],
  });

  return {
    success: true,
    message: '有效副属性已更新',
  };
};

const updateRelicRatingShouldLock = async (
  relicTitle: string,
  relicMainStat: string,
  shouldLock: {
    contain: string;
    include: {
      [key: string]: string[];
    };
  }
) => {
  const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
  if (!relicRatingInfo) {
    return {
      success: false,
      message: '无法找到当前遗器，请向Github提交issue',
    };
  }

  if (!relicRatingInfo[relicMainStat]) {
    return {
      success: false,
      message: '当前遗器的主属性无法找到，请先添加主属性为有效属性',
    };
  }
  // update the shouldLock
  relicRatingInfo[relicMainStat]['shouldLock'] = shouldLock;

  // save the updated relicRatingInfo
  await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

  // update the relicStore
  relicStore.setState({
    relicRatingInfo: relicRatingInfo[relicMainStat],
  });

  return {
    success: true,
    message: '锁定副属性已更新',
  };
};

const isMostValuableRelic = (
  shouldLock: {
    contain: string;
    include: {
      [key: string]: string[];
    };
  },
  relicSubStats: string[],
  containedSubStats: number
): boolean => {
  let isMostValuable = false;

  let contain = Number(shouldLock.contain);

  // 5 should be impossible to achieve
  if (isNaN(contain) || contain == 0) {
    contain = 5;
  }

  if (containedSubStats >= contain) {
    isMostValuable = true;
    return isMostValuable;
  }

  // check if the relicSubStats contains any of the shouldLock.include
  for (const subStat in shouldLock.include) {
    if (shouldLock.include[subStat].length > 0) {
      if (shouldLock.include[subStat].every((valuableSub: string) => relicSubStats.includes(valuableSub))) {
        isMostValuable = true;
        return isMostValuable;
      }
    }
  }

  return isMostValuable;
};

const labelValuableSubStats = (valuableSub: string[], relicSubStats: string[]) => {
  const isValuableSub: {
    [index: number]: boolean;
  } = {
    1: false,
    2: false,
    3: false,
    4: false,
  };

  relicSubStats.forEach((subStat: string, index: number) => {
    isValuableSub[index + 1] = valuableSub.includes(subStat);
  });

  return isValuableSub;
};

export default {
  getRelicRatingInfo,
  checkRelicRatingValuableMainAndSet: checkAndSetRelicRatingValuableMain,
  addRelicRatingValuableMain,
  removeRelicRatingValuableMain,
  updateRelicRatingValuableSub,
  updateRelicRatingShouldLock,
  isMostValuableRelic,
  labelValuableSubStats,
};
