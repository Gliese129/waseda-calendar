import type { InjectionKey } from 'vue'
import type { Store } from 'vuex/types/index.js'
import { createStore } from 'vuex/types/index.js'

interface State {
    courses: string[]
}

export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<State>({
    state: {
        courses: ['Math', 'English', 'Science'],
    },
})
