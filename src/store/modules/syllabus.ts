/**
 * This store contains basic information about Waseda course system.
 */
import { fetchHolidays, fetchQuarters } from '@/api/official/calendar'
import { fetchDepartments } from '@/api/syllabus/basic'
import type { SchoolYearDate } from '@/model/date'
import { searchLocalBeforeNetwork } from '@/utils/storage'

export interface SyllabusState {
    departments: {
        title: string
        value: string
    }[]
    periods: {
        start: string
        end: string
    }[]
    holidays: SchoolYearDate[]
    breaks: {
        start: string
    }[]
    quarters: {
        start: SchoolYearDate
        end: SchoolYearDate
    }[]
}

const baseFolder = 'syllabus/'

export const syllabusStore = {
    state: {
        departments: [],
        periods: [],
        holidays: [],
        quarters: [],
    },
    mutations: {
        setDepartments(state: SyllabusState, departments: any) {
            state.departments = departments
        },
        setHolidays(state: SyllabusState, holidays: any) {
            state.holidays = holidays
        },
        setQuarters(state: SyllabusState, quarters: any) {
            state.quarters = quarters
        },
    },
    actions: {
        async refresh({ commit }: { commit: any }) {
            // Fetch from network
            const departments = await searchLocalBeforeNetwork(
                baseFolder + 'departments',
                fetchDepartments
            )
            const holidays = await searchLocalBeforeNetwork(
                baseFolder + 'holidays',
                fetchHolidays
            )
            const quarters = await searchLocalBeforeNetwork(
                baseFolder + 'quarters',
                fetchQuarters
            )

            // Commit to state
            commit('setDepartments', departments)
            commit('setHolidays', holidays)
            commit('setQuarters', quarters)
        },
        async forceRefresh({ commit }: { commit: any }) {
            const departments = await searchLocalBeforeNetwork(
                baseFolder + 'departments',
                fetchDepartments,
                true
            )
            const holidays = await searchLocalBeforeNetwork(
                baseFolder + 'holidays',
                fetchHolidays,
                true
            )
            const quarters = await searchLocalBeforeNetwork(
                baseFolder + 'quarters',
                fetchQuarters,
                true
            )

            console.log('Force Refreshed departments:', departments)
            console.log(
                'Force Refreshed Holidays:',
                holidays.map((x: any) => x.toString())
            )
            console.log('Force Refreshed Quarters:', quarters)

            commit('setDepartments', departments)
            commit('setHolidays', holidays)
            commit('setQuarters', quarters)
        },
    },
}
