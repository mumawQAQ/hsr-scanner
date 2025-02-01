import { useEffect } from 'react'
import { check } from '@tauri-apps/plugin-updater'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export function useCheckAppUpdate() {
    useEffect(() => {
        const lastTime = window.localStorage.getItem('last_app_update_check_time')
        const now = dayjs()
        if (lastTime) {
            const time = dayjs(lastTime)
            if (now.diff(time, 'day') < 1) {
                return
            }
        }

        window.localStorage.setItem('last_app_update_check_time', now.format('YYYY-MM-DD'))

        check()
            .then((update) => {
                if (update?.available) {
                    toast.warning('检测到新的应用版本, 请进入设置更新', {
                        duration: 5000,
                    })
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }, [])
}
