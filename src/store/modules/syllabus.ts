import { fetchDepartments } from '@/api/syllabus/basic'

export interface SyllabusState {
    departments: {
        title: string
        value: string
    }[]
}

const baseFolder = 'syllabus'

export const syllabusStore = {
    state: {
        departments: [],
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
