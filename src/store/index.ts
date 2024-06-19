import type { Store } from 'vuex'
import { createStore } from 'vuex'
import { syllabusStore, type SyllabusState } from './modules/syllabus'
import { calendarStore, type CalendarState } from './modules/calendar'
import { userStore, type UserState } from './modules/user'
import type { InjectionKey } from 'vue'

interface State {
    syllabus: SyllabusState
    calendar: CalendarState
    user: UserState
}

export const key: InjectionKey<Store<State>> = Symbol('store')

export const store = createStore<{
    syllabus: SyllabusState
    calendar: CalendarState
    user: UserState
}>({
    modules: {
        syllabus: {
            namespaced: true,
            ...syllabusStore,
        },
        calendar: {
            namespaced: true,
            ...calendarStore,
        },
        user: {
            namespaced: true,
            ...userStore,
        },
    },
})
