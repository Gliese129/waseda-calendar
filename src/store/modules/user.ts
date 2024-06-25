/**
 * This store contains states of user
 */

import { getUserInfoQuery, updateUserInfoQuery } from '@/database/user'
import type { SQLiteAction } from '@/utils/sqlite'

export interface UserState {
    displayLanguage: string
    searchLanguage: string
    courseNotification: boolean
    department: string
    firstLogin: boolean
}

export const userStore = {
    state: {
        displayLanguage: 'ja',
        searchLanguage: 'ja',
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
        async saveToDB({ state }: { state: UserState }, $sqlite: SQLiteAction) {
            await $sqlite(async (db) => {
                await db.run(updateUserInfoQuery, [
                    state.displayLanguage,
                    state.searchLanguage,
                    state.courseNotification ? 1 : 0,
                    state.department,
                    0,
                ])
            })
        },

        async init({ commit }: { commit: any }, $sqlite: SQLiteAction) {
            await $sqlite(async (db) => {
                const result = (await db.query(getUserInfoQuery)).values
                if (result) {
                    const {
                        course_notification,
                        department,
                        display_language,
                        first_login,
                        search_language,
                    } = result[0]
                    commit('setDisplayLanguage', display_language)
                    commit('setSearchLanguage', search_language)
                    commit('setCourseNotification', course_notification ? true : false)
                    commit('setDepartment', department)
                    commit('setFirstLogin', first_login ? true : false)
                } else {
                    throw new Error('User not found')
                }
            })
        },
    },
}
