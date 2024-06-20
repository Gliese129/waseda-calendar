/**
 * This store contains states of user
 */

import { getLocal, saveLocal } from '@/utils/storage'

export interface UserState {
    displayLanguage: string
    searchLanguage: string
    courseNotification: boolean
    department: string
    firstLogin: boolean
}

const baseFolder = 'user/'

export const userStore = {
    state: {
        displayLanguage: 'ja-JP',
        searchLanguage: 'ja-JP',
        courseNotification: false,
        department: '',
        firstLogin: true,
    },
    mutations: {
        setDisplayLanguage(state: UserState, language: string) {
            state.displayLanguage = language
        },
        setSearchLanguage(state: UserState, searchLanguage: string) {
            state.searchLanguage = searchLanguage
        },
        setCourseNotification(state: UserState, coursePush: boolean) {
            state.courseNotification = coursePush
        },
        setDepartment(state: UserState, department: string) {
            state.department = department
        },
        setFirstLogin(state: UserState, firstLogin: boolean) {
            state.firstLogin = firstLogin
        },
    },
    actions: {
        setDisplayLanguage({ commit }: { commit: any }, displayLanguage: string) {
            commit('setDisplayLanguage', displayLanguage)
            saveLocal(baseFolder + 'displayLanguage', displayLanguage)
        },
        setSearchLanguage({ commit }: { commit: any }, searchLanguage: string) {
            commit('setSearchLanguage', searchLanguage)
            saveLocal(baseFolder + 'searchLanguage', searchLanguage)
        },
        setCourseNotification({ commit }: { commit: any }, coursePush: boolean) {
            commit('setCourseNotification', coursePush)
            saveLocal(baseFolder + 'coursePush', coursePush)
        },
        setDepartment({ commit }: { commit: any }, department: string) {
            commit('setDepartment', department)
            saveLocal(baseFolder + 'department', department)
        },
        setFirstLogin({ commit }: { commit: any }, firstLogin: boolean) {
            commit('setFirstLogin', firstLogin)
            saveLocal(baseFolder + 'firstLogin', firstLogin)
        },

        async init({ commit }: { commit: any }) {
            let displayLanguage = (await getLocal(baseFolder + 'displayLanguage')) ?? 'ja_jp'
            let searchLanguage = (await getLocal(baseFolder + 'searchLanguage')) ?? 'ja_jp'
            let coursePush = (await getLocal(baseFolder + 'coursePush')) ?? false
            let department = (await getLocal(baseFolder + 'department')) ?? ''
            let firstLogin = (await getLocal(baseFolder + 'firstLogin')) ?? true

            commit('setDisplayLanguage', displayLanguage)
            commit('setSearchLanguage', searchLanguage)
            commit('setCourseNotification', coursePush)
            commit('setDepartment', department)
            commit('setFirstLogin', firstLogin)
        },
    },
}
