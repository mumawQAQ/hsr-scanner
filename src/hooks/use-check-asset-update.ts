import { useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function useCheckAssetUpdate() {
    useEffect(() => {
        const lastTime = window.localStorage.getItem('last_asset_update_check_time')
        const now = dayjs()
        if (lastTime) {
            const time = dayjs(lastTime)
            if (now.diff(time, 'day') < 1) {
                return
            }
        }

        window.localStorage.setItem('last_asset_update_check_time', now.format('YYYY-MM-DD'))

        invoke<string>('check_asserts_update', { download: false })
            .then((response) => {
                const assertUpdateCheckResponse: any = JSON.parse(response)
                if (assertUpdateCheckResponse.update_needed) {
                    toast.warning('检测到新的资源版本, 请进入设置更新', {
                        duration: 5000,
                    })
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }, [])
}
