import type { Store } from 'vuex'
import { createStore } from 'vuex'
import type { SyllabusState } from './modules/syllabus'
import { syllabusStore } from './modules/syllabus'
import type { CalendarState } from './modules/calendar'
import { calendarStore } from './modules/calendar'
import type { SystemState } from './modules/system'
import { systemStore } from './modules/system'
import type { InjectionKey } from 'vue'

export const key: InjectionKey<
Store<{
    syllabus: SyllabusState
    calendar: CalendarState
    system: SystemState
}>
> = Symbol('store')

export const store = createStore<{
    syllabus: SyllabusState
    calendar: CalendarState
    system: SystemState
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
        system: {
            namespaced: true,
            ...systemStore,
        },
    },
})
