import { semesterJp } from '@/resources/semester'
import * as MathUtils from '@/utils/math'
import { dayOfWeek } from '@/utils/locale'

const _simpleArrayClone = (arr: any[]) => {
    if (!arr) return []
    return arr.map((x) => x)
}

export class Course {
    public static deepCopy(target: Course, source: Course) {
        target.code = source.code
        target.name = source.name
        target.teachers = _simpleArrayClone(source.teachers)
        target.department = source.department
        if (!source.schedules) source.schedules = []
        target.schedules = source.schedules.map((tp) => {
            return {
                term: _simpleArrayClone(tp.term),
                day: tp.day,
                period: _simpleArrayClone(tp.period),
                classroom: tp.classroom,
            }
        })
        target.PeriodStr = source.PeriodStr
        target.classroomStr = source.classroomStr
        target.url = source.url
        target.key = source.key
        target.credits = source.credits
        target.campus = source.campus
        target.leastGrade = source.leastGrade
        target.textbook = source.textbook
        target.departmentFull = source.departmentFull
        target.year = source.year
    }

    public code: string
    public name: string
    public teachers: string[]
    public department: string
    public schedules: SchedulesInfo[]
    public PeriodStr: string | null | undefined // this param is only used when period str cannot be parsed
    public classroomStr: string | null | undefined // this param is only used when period str cannot be parsed
    public url: string
    public key: string
    // the following params are only shown in the detail page
    public credits: number
    public campus: string | null | undefined
    public leastGrade: string // the least grade to take this course
    public textbook: string | null | undefined
    public departmentFull: string | null | undefined
    public year: number | null | undefined // school year

    public constructor(code: string, name: string) {
        this.code = code
        this.name = name
        this.teachers = []
        this.department = ''
        this.schedules = []
        this.url = ''
        this.key = ''
        this.credits = 0
        this.leastGrade = ''
        this.textbook = ''
    }

    public termStr2Num(term: string): number[] {
        let termIndex = semesterJp.findIndex((s) => s.name === term)
        if (termIndex === -1) return []
        return semesterJp[termIndex].value
    }

    public addSchedules(termStr: string, dayPeriodStr: string, classroomStr: string) {
        let timeGroupRegex = /([月火水木金土日])\s*([\d-]+)(時限)?/g
        let classGroupRegex = /\d+\-B?\d+/g
        let timeMatch = timeGroupRegex.exec(dayPeriodStr)
        let classMatch = classGroupRegex.exec(classroomStr)
        let days = []
        let periods = []
        let classrooms = []
        // match
        while (timeMatch) {
            days.push(dayOfWeek[timeMatch[1] as keyof typeof dayOfWeek])
            let period = timeMatch[2].split('-').map((p) => parseInt(p, 10))
            if (period.length === 1) periods.push([period[0], period[0]])
            else periods.push([period[0], period[1]])
            timeMatch = timeGroupRegex.exec(dayPeriodStr)
        }
        while (classMatch) {
            classrooms.push(classMatch[0])
            classMatch = classGroupRegex.exec(classroomStr)
        }
        let term = termStr.split('\n').map((t) => this.termStr2Num(t))

        // broadcast the same term to all schedules
        const lengths = [term.length, days.length, periods.length]
        let lca = MathUtils.lca(lengths)
        // the only case that could broadcast is when there is only 1 and lca in the lengths
        for (const length of lengths) {
            if (length !== 1 && length !== lca) {
                this.PeriodStr = dayPeriodStr
                this.classroomStr = classroomStr
                return
            }
        }
        // broadcast!
        for (let i = 0; i < lca; i++) {
            let termIndex = i % term.length
            let dayIndex = i % days.length
            let periodIndex = i % periods.length
            let classroomIndex = i % classrooms.length
            this.schedules.push({
                term: term[termIndex],
                day: days[dayIndex],
                period: periods[periodIndex],
                classroom: classrooms[classroomIndex],
            })
        }
    }

    public setUrl(onclickStr: string) {
    // "post_submit('JAA104DtlSubCon', '11000012C001202411000012C011')"
        let keyRegex = /post_submit\('(\w+)', '(\w+)'\)/g
        let keyMatch = keyRegex.exec(onclickStr)
        if (keyMatch) {
            this.key = keyMatch[2]
            // "https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=11000012C001202411000012C011"
            this.url = `https://www.wsl.waseda.jp/syllabus/JAA104.php?pKey=${keyMatch[2]}`
        }
    }
}

export interface SchedulesInfo {
    term: number[]
    day: number
    period: number[] // start period and end period
    classroom: string
}
