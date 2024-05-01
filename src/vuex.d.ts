import type { State } from '@/store/index'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: import('vuex').Store<State>
    }
}