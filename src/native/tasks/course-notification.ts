import type { Course } from '@/model/course'
import { AcademicDate } from '@/model/date'
import { CourseNotification } from '@/native/plugins'
import { store } from '@/store'

const formatParams = (
    periods: string[][],
    courses: Course[],
    holidays: AcademicDate[]
) => {
    let quarters = store.state.syllabus.quarters
    let now = new AcademicDate()
    let currQuarter = quarters.findIndex((quarter) =>
        now.isBetween(quarter.start, quarter.end)
    )
    return {
        periods: periods,
        courses: courses
            .filter((course) => {
                return course.schedules
                    .map((item) => item.term)
                    .flat()
                    .includes(currQuarter)
            })
            .map((course) => {
                return {
                    name: course.name,
                    schedules: course.schedules
                        .filter((schedule) => schedule.term.includes(currQuarter))
                        .map((schedule) => {
                            return {
                                classroom: schedule.classroom,
                                start: schedule.period[0],
                                end: schedule.period[1],
                                day: schedule.day,
                            }
                        }),
                }
            }),
        holidays: holidays.map((holiday) =>
            holiday.getAdjustedDate().toLocaleDateString('ja-JP')
        ),
    }
}

export const startPush = async (
    periods: string[][],
    courses: Course[],
    holidays: AcademicDate[]
) => {
    await CourseNotification.start(formatParams(periods, courses, holidays))
}
export const stopPush = async () => {
    CourseNotification.stop()
}
export const updatePush = async (
    periods: string[][],
    courses: Course[],
    holidays: AcademicDate[]
) => {
    if (periods.length === 0 || courses.length === 0 || holidays.length === 0) {
        return
    }
    CourseNotification.update(formatParams(periods, courses, holidays))
}

export default {
    startPush,
    stopPush,
    updatePush,
}
