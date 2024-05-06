/**
 * This store contains basic information about Waseda course system.
 */
import { fetchDepartments } from '@/api/syllabus/basic'
import { searchLocalBeforeNetwork } from '@/utils/storage'

export interface SyllabusState {
    departments: {
        title: string
        value: string
    }[]
    periods: {
        start: Date
        end: Date
    }[]
}

const baseFolder = 'syllabus/'

export const syllabusStore = {
    state: {
        departments: [],
        periods: [],
    },
    mutations: {
        setDepartments(state: SyllabusState, departments: any) {
            state.departments = departments
        },
    },
    actions: {
        async fetchAllDepartments({ commit }: { commit: any }) {
            const departments = searchLocalBeforeNetwork(
                baseFolder + 'departments',
                fetchDepartments
            )
            commit('setDepartments', departments)
        },
        async refresh({ commit }: { commit: any }) {
            // Fetch from network
            const departments = await fetchDepartments()

            // Log
            console.log('Refreshed departments:', departments)

            // Commit to state
            commit('setDepartments', departments)

            // Save to localStorage
            localStorage.setItem(
                baseFolder + 'departments',
                JSON.stringify(departments)
            )
        },
    },
}
