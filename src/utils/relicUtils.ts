const getRelicRatingInfo = async (relicTitle: string, relicMainStat: string) => {
    const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);

    // make sure the relicRatingInfo is not undefined
    if (!relicRatingInfo) {
        return null;
    }

    // get the valuable sub stats and should lock
    const relicRatingDetail = relicRatingInfo[relicMainStat]

    // make sure the relicRatingDetail is not undefined
    if (!relicRatingDetail) {
        return null;
    }
    return {
        valuableSub: relicRatingDetail['valuableSub'],
        shouldLock: relicRatingDetail['shouldLock']
    };
}

const updateRelicRatingValuableSub = async (relicTitle: string, relicMainStat: string, valuableSub: string[]) => {
    const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
    if (!relicRatingInfo) {
        return {
            success: false,
            message: 'relicRatingInfo is not found by relicTitle'
        };
    }

    if (!relicRatingInfo[relicMainStat]) {
        return {
            success: false,
            message: 'relicRatingDetail is not found by relicMainStat'
        };
    }
    // update the valuableSub
    relicRatingInfo[relicMainStat]['valuableSub'] = valuableSub;

    // save the updated relicRatingInfo
    await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

    return {
        success: true,
        message: 'valuableSub is updated'
    }
}


const updateRelicRatingShouldLock = async (relicTitle: string, relicMainStat: string, shouldLock: string[][]) => {
    const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
    if (!relicRatingInfo) {
        return {
            success: false,
            message: 'relicRatingInfo is not found by relicTitle'
        };
    }

    if (!relicRatingInfo[relicMainStat]) {
        return {
            success: false,
            message: 'relicRatingDetail is not found by relicMainStat'
        };
    }
    // update the shouldLock
    relicRatingInfo[relicMainStat]['shouldLock'] = shouldLock;

    // save the updated relicRatingInfo
    await (window as any).ipcRenderer.storeSet(`data.relicRating.${relicTitle}`, relicRatingInfo);

    return {
        success: true,
        message: 'shouldLock is updated'
    }
}


const isMostValuableRelic = (shouldLock: string[][], relicSubStats: string[]): boolean => {
    return shouldLock.some(lock => lock.every(subStat => relicSubStats.includes(subStat)));
}

const labelValuableSubStats = (valuableSub: string[], relicSubStats: string[]) => {
    const isValuableSub: {
        [index: number]: boolean
    } = {
        1: false,
        2: false,
        3: false,
        4: false
    }

    relicSubStats.forEach((subStat: string, index: number) => {
        isValuableSub[index + 1] = valuableSub.includes(subStat);
    })

    return isValuableSub;
}


export default {
    getRelicRatingInfo,
    updateRelicRatingValuableSub,
    updateRelicRatingShouldLock,
    isMostValuableRelic,
    labelValuableSubStats
}
