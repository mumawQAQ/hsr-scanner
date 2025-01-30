import { create } from 'zustand'
import { RelicInfo, RelicScore } from '@/types/relic-types.ts'

type RelicStore = {
    relicInfo: RelicInfo | null
    relicScores: RelicScore[] | null

    setRelicInfo: (info: RelicInfo) => void
    setRelicScores: (scores: RelicScore[]) => void
}

const useRelic = create<RelicStore>((set) => ({
    relicInfo: null,
    relicScores: null,

    setRelicInfo: (info: RelicInfo) => set({ relicInfo: info }),
    setRelicScores: (scores: RelicScore[]) => set({ relicScores: scores }),
}))

export default useRelic
