import { RelicRuleMainStats, RelicRuleSubStats } from '@/types/relic-rule-type.ts'

export type RelicBoxPositionType = 'relic_main_stat' | 'relic_sub_stat' | 'relic_title'

export type ApiResponse<T> = {
    status: 'success' | 'failed'
    message: string // this only exists when status is 'error'
    data?: T // this only exists when status is 'success'
}

export type CreateRelicTemplateRequest = {
    id: string
    name: string
    description: string
    author: string
}

export type CreateRelicRuleRequest = {
    template_id: string
}

export type DeleteRelicRuleRequest = {
    template_id: string
    rule_id: string
}

export type UpdateRelicRuleRequest = {
    id: string
    set_names: string[]
    valuable_mains: RelicRuleMainStats
    valuable_subs: RelicRuleSubStats[]
    fit_characters: string[]
}

export type AssertUpdateCheckResponse = {
    update_needed?: boolean
    files?: string[]
    errors?: string[]
}

export type StartPipelineRequest = {
    pipeline_name: string
    meta_data?: Record<string, string | boolean | number | undefined | null | object>
}

export type MousePositionRequest = {
    mouse_x: number
    mouse_y: number
}

export type RelicBoxPositionRequest = {
    type: RelicBoxPositionType
    box: {
        x: number
        y: number
        w: number
        h: number
    }
}

export type RelicBoxPositionResponse = {
    key: RelicBoxPositionType
    value: {
        x: number
        y: number
        w: number
        h: number
    }
}

export type DiscardIconPositionRequest = {
    x: number
    y: number
}

export type DiscardIconPositionResponse = {
    key: string
    value: {
        x: number
        y: number
    }
}
