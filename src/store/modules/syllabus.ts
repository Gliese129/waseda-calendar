/**
 * This store contains basic information about Waseda course system.
 */
import { fetchHolidays, fetchPeriods, fetchQuarters } from '@/api/official/calendar'
import { fetchDepartments } from '@/api/syllabus/basic'
import { AcademicDate, SimpleTime } from '@/model/date'
import { getLocal, searchLocalBeforeNetwork } from '@/utils/storage'

export interface SyllabusState {
    departments: {
        name: string
        abbr: string
        value: string
    }[]
    periods: {
        start: SimpleTime
        end: SimpleTime
    }[]
    holidays: AcademicDate[]
    breaks: {
        start: string
    }[]
    quarters: {
        start: AcademicDate
        end: AcademicDate
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
                Object.setPrototypeOf(item, AcademicDate.prototype)
            })
            state.holidays = holidays
        },
        setQuarters(state: SyllabusState, quarters: any) {
            quarters.forEach((item: any) => {
                item.start = Object.setPrototypeOf(item.start, AcademicDate.prototype)
                item.end = Object.setPrototypeOf(item.end, AcademicDate.prototype)
            })
            state.quarters = quarters
        },
        setPeriods(state: SyllabusState, periods: any) {
            state.periods = periods.map((item: any) => {
                return {
                    start: new SimpleTime(item.start.hour, item.start.minute),
                    end: new SimpleTime(item.end.hour, item.end.minute),
                }
            })
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
            const periods = await searchLocalBeforeNetwork(baseFolder + 'periods', fetchPeriods)

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
            console.log(
                'Force Refreshed Periods:',
                periods.map((x: any) => x.toString())
            )

            commit('setDepartments', departments)
            commit('setHolidays', holidays)
            commit('setQuarters', quarters)
            commit('setPeriods', periods)
        },
        async checkConfigDataLoaded({ state }: { state: SyllabusState }) {
            // Check if data is already loaded
            if (
                state.departments.length > 0 &&
        state.holidays.length > 0 &&
        state.quarters.length > 0 &&
        state.periods.length > 0
            )
                return true
            // Check if data is in local storage
            const departments = (await getLocal(baseFolder + 'departments')) ?? []
            const holidays = (await getLocal(baseFolder + 'holidays')) ?? []
            const quarters = (await getLocal(baseFolder + 'quarters')) ?? []
            const periods = (await getLocal(baseFolder + 'periods')) ?? []

            return (
                departments.length > 0 &&
        holidays.length > 0 &&
        quarters.length > 0 &&
        periods.length > 0
            )
        },
    },
}
