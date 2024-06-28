/**
 * This store contains data of user's courses.
 */
import {
    addCourseQuery,
    deleteCourseByCodeQuery,
    getAllCoursesQuery,
} from '@/database/courses'
import { deleteAllPeriodsQuery, generateAddPeriodsBatchQuery } from '@/database/periods'
import { Course } from '@/model/course'
import { SimpleTime } from '@/model/date'
import type { SQLiteAction } from '@/utils/sqlite'
import { getLocal, saveLocal } from '@/utils/storage'

export interface CalendarState {
    courses: Course[]
    periods: {
        start: SimpleTime
        end: SimpleTime
    }[]
}

const baseFolder = 'courses/'

export const calendarStore = {
    state: {
        courses: [],
        periods: [],
    },
    mutations: {
        addCourse(state: CalendarState, course: any) {
            state.courses.push(course)
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
        checkConflict(state: CalendarState, course: any) {
            const courses = state.courses.slice()
            courses.push(course)
            // init timetable
            const timetable = [] as number[][][]
            for (let semester = 0; semester < 4; ++semester) {
                let semesterArray = []
                for (let day = 0; day < 7; ++day) {
                    let dayArray = []
                    for (const _ of state.periods) {
                        dayArray.push(-1)
                    }
                    semesterArray.push(dayArray)
                }
                timetable.push(semesterArray)
            }
            // arrange courses
            courses.forEach((course, idx) => {
                console.log('Checking course:', course)
                course.schedules.forEach((schedule) => {
                    schedule.semester.forEach((semester) => {
                        let day = schedule.day
                        let periodInterval = schedule.period
                        for (let period = periodInterval[0]; period <= periodInterval[1]; ++period) {
                            if (timetable[semester][day][period] !== -1) {
                                let conflictId = timetable[semester][day][period]
                                console.log(conflictId, semester, day, period)
                                console.log(timetable)
                                throw new Error(courses[conflictId].name)
                            }
                            timetable[semester][day][period] = idx
                        }
                    })
                })
            })
        },
    },
    actions: {
        async addCourse(
            { commit }: { commit: any },
            payload: { course: any; $sqlite: SQLiteAction }
        ) {
            const { course, $sqlite } = payload

            let currCourse = new Course(course.code, course.name)
            Course.deepCopy(currCourse, course)
            console.log('Adding course:', currCourse)
            commit('checkConflict', currCourse)

            $sqlite(async (db) => {
                await db.run(addCourseQuery, [
                    currCourse.code,
                    currCourse.name,
                    JSON.stringify(currCourse.teachers),
                    JSON.stringify(currCourse.schedules),
                    currCourse.academicYear,
                    currCourse.campus,
                    currCourse.department,
                    currCourse.credits,
                    currCourse.url,
                    currCourse.textbook,
                ])
            })
            commit('addCourse', currCourse)

            console.log('Added course:', currCourse)
        },

        async deleteCourse(
            { commit }: { commit: any },
            payload: { course: any; $sqlite: SQLiteAction }
        ) {
            const { course, $sqlite } = payload

            $sqlite(async (db) => {
                commit('deleteCourse', course)
                db.run(deleteCourseByCodeQuery, [course.code])
            })
        },

        async setPeriods(
            { commit }: { commit: any },
            payload: {
                periods: {
                    start: SimpleTime
                    end: SimpleTime
                }[]
                $sqlite: SQLiteAction
            }
        ) {
            const { periods, $sqlite } = payload
            $sqlite(async (db) => {
                await db.run(deleteAllPeriodsQuery)
                const { query, data } = generateAddPeriodsBatchQuery(periods)
                console.log(query, data)
                await db.run(query, data)
            })
            commit('setPeriods', periods)
        },

        async init({ commit }: { commit: any }, $sqlite: SQLiteAction) {
            $sqlite(async (db) => {
                const courses =
          (await db.query(getAllCoursesQuery)).values?.map((course) => {
              course.schedules = JSON.parse(course.schedules)
              course.teachers = JSON.parse(course.teachers)
              return course
          }) ?? []
                commit('setCourses', courses)

                const periodsData = (await db.query('SELECT * FROM periods')).values
                    ?.sort((x) => x.id)
                    .map((period) => ({
                        start: new SimpleTime(period.start),
                        end: new SimpleTime(period.end),
                    }))

                const periods = periodsData?.length
                    ? periodsData
                    : await getLocal('syllabus/periods')

                periods?.forEach((period: any) => {
                    Object.setPrototypeOf(period.start, SimpleTime.prototype)
                    Object.setPrototypeOf(period.end, SimpleTime.prototype)
                })
                commit('setPeriods', periods)
            })
        },
    },
}
