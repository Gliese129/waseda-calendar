interface SimpleCourse {
    name: string
    schedules: {
        classroom: string
        start: number
        end: number
        day: number
    }[]
}

export interface CourseNotificationPlugin {
    start: (options: {
        periods: string[][]
        courses: SimpleCourse[]
        holidays: string[]
    }) => Promise<void>
    stop: () => Promise<void>
    update: (options: {
        periods: string[][]
        courses: SimpleCourse[]
        holidays: string[]
    }) => Promise<void>
}
