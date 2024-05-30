/**
 * This store contains states of system
 */

export interface SystemState {
    language: string
    coursePush: boolean
}

// const baseFolder = 'system/'

export const systemStore = {
    state: {
        language: 'en',
        coursePush: false,
    },
    mutations: {
        setLanguage(state: SystemState, language: string) {
            state.language = language
        },
        setCoursePush(state: SystemState, coursePush: boolean) {
            state.coursePush = coursePush
        },
    },
    actions: {
        setLanguage({ commit }: { commit: any }, language: string) {
            commit('setLanguage', language)
        },
        setCoursePush({ commit }: { commit: any }, coursePush: boolean) {
            commit('setCoursePush', coursePush)
        },
    },
}
