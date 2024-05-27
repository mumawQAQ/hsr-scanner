const getRelicRatingInfo = async (relicTitle: string, relicMainStat: string) => {
    const relicRatingInfo = await (window as any).ipcRenderer.storeGet(`data.relicRating.${relicTitle}`);
    console.log(relicRatingInfo);

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
        validSub: relicRatingDetail['validSub'],
        shouldLock: relicRatingDetail['shouldLock']
    };
}


const isMostValuableRelic = (shouldLock: string[][], relicSubStats: string[]) => {
    shouldLock.forEach((shouldLock: string[]) => {
        if (shouldLock.every((subStat: string) => relicSubStats.includes(subStat))) {
            return true;
        }
    })
    return false;
}

const labelValuableSubStats = (validSub: string[], relicSubStats: string[]) => {
    const isValuableSub: {
        [index: number]: boolean
    } = {
        1: false,
        2: false,
        3: false,
        4: false
    }

    relicSubStats.forEach((subStat: string, index: number) => {
        isValuableSub[index + 1] = validSub.includes(subStat);
    })

    return isValuableSub;
}


export default {
    getRelicRatingInfo,
    isMostValuableRelic,
    labelValuableSubStats
}
