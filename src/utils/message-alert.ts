import type { Plugin } from 'vue'
import { ref } from 'vue'

export interface CustomNotification {
    message: string
    type: 'info' | 'success' | 'warning' | 'error'
}
export const globalNotifyPlugin: Plugin = {
    install(app, _) {
        const msgStack = ref<CustomNotification[]>([])
        app.config.globalProperties.$msgStack = msgStack
        app.config.globalProperties.$message = (
            message: string,
            type: 'info' | 'success' | 'warning' | 'error',
            showTime = 2000
        ) => {
            msgStack.value.push({ message, type })
            setTimeout(() => {
                msgStack.value.shift()
            }, showTime)
        }
        console.log('global-notify-plugin installed')
        app.provide('$msgStack', msgStack)
        app.provide('$message', app.config.globalProperties.$message)
    },
}
