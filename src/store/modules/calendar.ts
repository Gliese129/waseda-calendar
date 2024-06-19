/**
 * This store contains data of user's courses.
 */
import { Course } from '@/model/course'
import { SimpleTime } from '@/model/date'
import { getLocal, saveLocal } from '@/utils/storage'

export interface CalendarState {
    courses: Course[]
    timetable: number[][][]
    periods: {
        start: SimpleTime
        end: SimpleTime
    }[]
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
            courses.forEach((course: any) => {
                Object.setPrototypeOf(course, Course.prototype)
            })
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
        setPeriods(state: CalendarState, periods: any) {
            periods.forEach((period: any) => {
                Object.setPrototypeOf(period.start, SimpleTime.prototype)
                Object.setPrototypeOf(period.end, SimpleTime.prototype)
            })
            state.periods = periods
            saveLocal(baseFolder + 'periods', state.periods)
        },
        updateTimetable(state: CalendarState) {
            for (let i = 0; i < state.courses.length; ++i) {
                let course = state.courses[i]
                course.schedules.forEach((schedules) => {
                    schedules.semester.forEach((semester) => {
                        let day = schedules.day
                        let periodInterval = schedules.period
                        for (let period = periodInterval[0]; period <= periodInterval[1]; ++period) {
                            if (state.timetable[semester][day][period] !== -1) {
                                let conflictId = state.timetable[semester][day][period]
                                throw new Error('Conflict with ' + state.courses[conflictId].name)
                            }
                            state.timetable[semester][day][period] = i
                        }
                    })
                })
            }
        },
        initTimetable(state: CalendarState) {
            state.timetable = []
            for (let semester = 0; semester < 4; ++semester) {
                let semesterArray = []
                for (let day = 0; day < 7; ++day) {
                    let dayArray = []
                    for (const _ of state.periods) {
                        dayArray.push(-1)
                    }
                    semesterArray.push(dayArray)
                }
                state.timetable.push(semesterArray)
            }
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
            let courses = (await getLocal(baseFolder + 'courses')) ?? []
            commit('setCourses', courses)
            let periods =
        (await getLocal(baseFolder + 'periods')) ??
        (await getLocal('syllabus/periods')) ??
        []
            commit('setPeriods', periods)
            commit('initTimetable')
        },
        async setPeriods({ commit }: { commit: any }, periods: string[][]) {
            commit(
                'setPeriods',
                periods.map((x) => {
                    return {
                        start: new SimpleTime(x[0]),
                        end: new SimpleTime(x[1]),
                    }
                })
            )
        },
    },
}
