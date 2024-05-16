/**
 * This store contains basic information about Waseda course system.
 */
import { fetchHolidays, fetchPeriods, fetchQuarters } from '@/api/official/calendar'
import { fetchDepartments } from '@/api/syllabus/basic'
import { SchoolYearDate } from '@/model/date'
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
            holidays.forEach((item: any) => {
                Object.setPrototypeOf(item, SchoolYearDate.prototype)
            })
            state.holidays = holidays
        },
        setQuarters(state: SyllabusState, quarters: any) {
            quarters.forEach((item: any) => {
                item.start = Object.setPrototypeOf(item.start, SchoolYearDate.prototype)
                item.end = Object.setPrototypeOf(item.end, SchoolYearDate.prototype)
            })
            state.quarters = quarters
        },
        setPeriods(state: SyllabusState, periods: any) {
            state.periods = periods
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
            const periods = await searchLocalBeforeNetwork(
                baseFolder + 'periods',
                fetchQuarters
            )

            // Commit to state
            commit('setDepartments', departments)
            commit('setHolidays', holidays)
            commit('setQuarters', quarters)
            commit('setPeriods', periods)
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
            const periods = await searchLocalBeforeNetwork(
                baseFolder + 'periods',
                fetchPeriods,
                true
            )

            console.log('Force Refreshed departments:', departments)
            console.log(
                'Force Refreshed Holidays:',
                holidays.map((x: any) => x.toString())
            )
            console.log('Force Refreshed Quarters:', quarters)
            console.log('Force Refreshed Periods:', periods)

            commit('setDepartments', departments)
            commit('setHolidays', holidays)
            commit('setQuarters', quarters)
            commit('setPeriods', periods)
        },
    },
}
