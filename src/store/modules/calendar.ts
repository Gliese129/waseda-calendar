/**
 * This store contains data of user's courses.
 */
import { Course } from '@/model/course'
import { getLocal, saveLocal } from '@/utils/storage'
import { initPeriodSetting } from '@/resources/courses-date'

export interface CalendarState {
    courses: Course[]
    timetable: number[][][]
    periods: string[][]
}

const baseFolder = 'courses/'

export const calendarStore = {
    state: {
        courses: [],
        timetable: [],
        periods: [],
    },
    mutations: {
        addCourse(state: CalendarState, course: any) {
            state.courses.push(course)
            saveLocal(baseFolder + 'courses', state.courses)
        },
        popCourse(state: CalendarState) {
            state.courses.pop()
            saveLocal(baseFolder + 'courses', state.courses)
        },
        removeAllCourses(state: CalendarState) {
            state.courses = []
            saveLocal(baseFolder + 'courses', state.courses)
        },
        setCourses(state: CalendarState, courses: any) {
            state.courses = courses
            saveLocal(baseFolder + 'courses', state.courses)
        },
        deleteCourse(state: CalendarState, course: any) {
            let idx = state.courses.findIndex(
                (c) => c.code === course.code && c.name === course.name
            )
            state.courses.splice(idx, 1)
            saveLocal(baseFolder + 'courses', state.courses)
        },
        updateTimetable(state: CalendarState) {
            for (let i = 0; i < state.courses.length; ++i) {
                let course = state.courses[i]
                course.schedules.forEach((schedules) => {
                    schedules.term.forEach((term) => {
                        let day = schedules.day
                        let periodInterval = schedules.period
                        for (let period = periodInterval[0]; period <= periodInterval[1]; ++period) {
                            if (state.timetable[term][day][period] !== -1) {
                                let conflictId = state.timetable[term][day][period]
                                throw new Error('Conflict with ' + state.courses[conflictId].name)
                            }
                            state.timetable[term][day][period] = i
                        }
                    })
                })
            }
        },
        initTimetable(state: CalendarState) {
            state.timetable = []
            for (let term = 0; term < 4; ++term) {
                let termArray = []
                for (let day = 0; day < 7; ++day) {
                    let dayArray = []
                    for (const _ of state.periods) {
                        dayArray.push(-1)
                    }
                    termArray.push(dayArray)
                }
                state.timetable.push(termArray)
            }
        },
        initPeriods(state: CalendarState) {
            state.periods = initPeriodSetting
        },
        setPeriods(state: CalendarState) {
            // todo
            state.periods = initPeriodSetting
        },
    },
    actions: {
        async addCourse({ commit }: { commit: any }, course: Course) {
            let currCourse = new Course(course.code, course.name)
            Course.deepCopy(currCourse, course)
            commit('addCourse', course)
            try {
                commit('initTimetable')
                commit('updateTimetable')
            } catch (e) {
                // rollback if conflict
                commit('popCourse')
                throw e
            }
            console.log('Added course:', course)
        },
        async deleteCourse({ commit }: { commit: any }, course: Course) {
            commit('deleteCourse', course)
            commit('initTimetable')
        },
        async init({ commit }: { commit: any }) {
            // Fetch from network
            let courses = getLocal(baseFolder + 'courses')
            console.log('Init courses:', courses)
            courses = courses === null ? [] : courses
            commit('setCourses', courses)
            commit('initPeriods')
            commit('initTimetable')
        },
        async setPeriod({ commit }: { commit: any }, periods: string[][]) {
            commit('setPeriods', periods)
        },
    },
}
