export {}

declare module 'vue' {
    interface ComponentCustomProperties {
        $msgStack: Ref<
        {
            message: string
            type: 'info' | 'success' | 'warning' | 'error'
        }[]
        >
        $message: (
            message: string,
            type: 'info' | 'success' | 'warning' | 'error',
            showTime?: number
        ) => void
    }
}
