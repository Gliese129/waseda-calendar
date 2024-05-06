import { semesterJp } from '@/resources/semester'
import * as MathUtils from '@/utils/math'
import { dayOfWeek } from '@/utils/locale'

export class Course {
    public code: string
    public name: string
    public teachers: string[]
    public department: string
    public timePlace: TimePlaceInfo[]
    public PeriodStr: string | null | undefined // this param is only used when period str cannot be parsed
    public classroomStr: string | null | undefined // this param is only used when period str cannot be parsed
    public url: string
    public key: string
    // the following params are only shown in the detail page
    public credits: number | null | undefined
    public campus: string | null | undefined
    public leastGrade: string | null | undefined // the least grade to take this course
    public textbook: string | null | undefined
    public departmentFull: string | null | undefined

    public constructor(code: string, name: string) {
        this.code = code
        this.name = name
        this.teachers = []
        this.department = ''
        this.timePlace = []
        this.url = ''
        this.key = ''
    }

    public termStr2Num(term: string): number[] {
        let termIndex = semesterJp.findIndex((s) => s.name === term)
        if (termIndex === -1) return []
        return semesterJp[termIndex].value
    }

    public addTimePlace(
        termStr: string,
        dayPeriodStr: string,
        classroomStr: string
    ) {
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

        // broadcast the same term to all timePlace
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
            this.timePlace.push({
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

    public deepCopy(): Course {
        let course = new Course(this.code, this.name)
        course.teachers = this.teachers.slice()
        course.department = this.department
        course.timePlace = this.timePlace.map((tp) => {
            return {
                term: tp.term.slice(),
                day: tp.day,
                period: tp.period.slice(),
                classroom: tp.classroom,
            }
        })
        course.PeriodStr = this.PeriodStr
        course.classroomStr = this.classroomStr
        course.url = this.url
        course.key = this.key
        course.credits = this.credits
        course.campus = this.campus
        course.leastGrade = this.leastGrade
        course.textbook = this.textbook
        course.departmentFull = this.departmentFull
        return course
    }
}

export interface TimePlaceInfo {
    term: number[]
    day: number
    period: number[] // start period and end period
    classroom: string
}
