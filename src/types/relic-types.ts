export type RelicTitle = {
    title: string
    set_name: string
}

export type RelicSubStats = {
    name: string
    number: string
    score: [number]
}

export type RelicMainStats = {
    name: string
    number: string
    level: number
    enhance_level: number
}

export type RelicInfo = {
    relic_title: RelicTitle | null
    relic_main_stat: RelicMainStats | null
    relic_sub_stat: RelicSubStats[] | null
}

export type RelicScore = {
    score: number
    characters: string[]
    type: string
}
