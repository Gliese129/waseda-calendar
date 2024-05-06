import type { Store } from 'vuex'
import { createStore } from 'vuex'
import { syllabusStore } from './modules/syllabus'
import { calendarStore } from './modules/calendar'
import type { InjectionKey } from 'vue'

export const key: InjectionKey<Store<any>> = Symbol('store')

export const store = createStore({
    modules: {
        syllabus: {
            namespaced: true,
            ...syllabusStore,
        },
        calendar: {
            namespaced: true,
            ...calendarStore,
        },
    },
})
