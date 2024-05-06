import type { Store } from 'vuex'
import { createStore } from 'vuex'
import type { SyllabusState } from './modules/syllabus'
import { syllabusStore } from './modules/syllabus'
import type { CalendarState } from './modules/calendar'
import { calendarStore } from './modules/calendar'
import type { InjectionKey } from 'vue'

export const key: InjectionKey<
Store<{
    syllabus: SyllabusState
    calendar: CalendarState
}>
> = Symbol('store')

export const store = createStore<{
    syllabus: SyllabusState
    calendar: CalendarState
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
    },
})
