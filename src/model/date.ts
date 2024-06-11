class SimpleDate {
    public month!: number
    public day!: number

    // public constructor()
    // public constructor(date: Date)
    // public constructor(month: number, day: number)
    public constructor(arg1?: number | Date, arg2?: number) {
        if (arg1 === undefined) {
            this._initWithCurrentDate()
        } else if (arg1 instanceof Date) {
            this._initWithDate(arg1)
        } else if (typeof arg1 === 'number' && arg2 !== undefined) {
            this._initWithMonthDay(arg1, arg2)
        } else {
            throw new Error('Invalid arguments')
        }
    }

    public valueOf(): number {
        return this.month * 100 + this.day
    }

    private _initWithCurrentDate() {
        const currentDate = new Date()
        this.month = currentDate.getMonth() + 1
        this.day = currentDate.getDate()
    }

    private _initWithDate(date: Date) {
        this.month = date.getMonth() + 1
        this.day = date.getDate()
    }

    private _initWithMonthDay(month: number, day: number) {
        this.month = month
        this.day = day
    }
}

export class AcademicDate {
    public static newYearStart = new SimpleDate(4, 1)

    public static getAcademicYear(date = new Date()): number {
        let simpleDate = new SimpleDate()
        return simpleDate < this.newYearStart ? date.getFullYear() - 1 : date.getFullYear()
    }
    public static getStartDate(): Date {
        return new Date(
            this.getAcademicYear(),
            this.newYearStart.month - 1,
            this.newYearStart.day
        )
    }
    public static getEndDate(): Date {
        let endDate = new Date(
            this.getAcademicYear() + 1,
            this.newYearStart.month - 1,
            this.newYearStart.day
        )
        return new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
    }
    //
    public academicYear!: number
    public date!: SimpleDate

    // public constructor()
    // public constructor(month: number, day: number)
    // public constructor(month: number, day: number, academicYear: number)
    // public constructor(date: Date)
    public constructor(monthOrDate?: number | Date, day?: number, academicYear?: number) {
        if (monthOrDate === undefined) {
            this._initWithDate(new Date())
        } else if (monthOrDate instanceof Date) {
            this._initWithDate(monthOrDate)
        } else if (day !== undefined && academicYear !== undefined) {
            this._initWithYearMonthDay(academicYear, monthOrDate, day)
        } else if (day !== undefined) {
            this._initWithMonthDay(monthOrDate, day)
        } else {
            throw new Error('Invalid arguments')
        }
    }

    public getAdjustedDate(): Date {
        const month = this.date.month
        const day = this.date.day
        if (this.dateValueOf() < AcademicDate.newYearStart.valueOf()) {
            return new Date(this.academicYear + 1, month - 1, day)
        } else {
            return new Date(this.academicYear, month - 1, day)
        }
    }

    public toString(isAcademicYear = true, onlyDate = false): string {
        if (isAcademicYear)
            return this.date.toString() + (onlyDate ? '' : ` [${this.academicYear}]`)
        return this.getAdjustedDate().toLocaleDateString()
    }

    public valueOf(): number {
        return this.getAdjustedDate().valueOf()
    }
    public dateValueOf(): number {
        return this.date.month * 100 + this.date.day
    }
    public equals(other: AcademicDate): boolean {
        return (
            this.academicYear === other.academicYear &&
      this.date.valueOf() === other.date.valueOf()
        )
    }
    public isBetween(start: AcademicDate, end: AcademicDate): boolean {
        return this.valueOf() >= start.valueOf() && this.valueOf() <= end.valueOf()
    }
    public isBetweenDate(start: Date, end: Date): boolean {
        const adjustedDate = this.getAdjustedDate().valueOf()
        return adjustedDate >= start.valueOf() && adjustedDate <= end.valueOf()
    }
    // Private constructors
    private _initWithDate(date: Date) {
        this.academicYear = date.getFullYear()
        this.date = new SimpleDate(date.getMonth() + 1, date.getDate())
        if (this.date.valueOf() < AcademicDate.newYearStart.valueOf()) {
            this.academicYear--
        }
    }

    private _initWithYearMonthDay(academicYear: number, month: number, day: number) {
        this.academicYear = academicYear
        this.date = new SimpleDate(month, day)
    }

    private _initWithMonthDay(month: number, day: number) {
        this.academicYear = AcademicDate.getAcademicYear()
        this.date = new SimpleDate(month, day)
        if (this.date.valueOf() < AcademicDate.newYearStart.valueOf()) {
            this.academicYear--
        }
    }
}

export class SimpleTime {
    public hour!: number
    public minute!: number

    // public constructor()
    // public constructor(time: SimpleTime)
    // public constructor(time: Date)
    // public constructor(hour: number, minute: number)
    // public constructor(time: string)
    public constructor(arg1?: string | number | SimpleTime | Date, arg2?: number) {
        if (arg1 === undefined) {
            this._initWithCurrentTime()
        } else if (typeof arg1 === 'string') {
            this._initWithString(arg1)
        } else if (arg1 instanceof SimpleTime) {
            this.hour = arg1.hour
            this.minute = arg1.minute
        } else if (arg1 instanceof Date) {
            this._initWithDate(arg1)
        } else if (typeof arg1 === 'number' && arg2 !== undefined) {
            this._initWithHourMinute(arg1, arg2)
        } else {
            throw new Error('Invalid arguments')
        }
    }

    public valueOf(): number {
        return this.hour * 100 + this.minute
    }
    public toString(): string {
        return `${this.hour.toString().padStart(2, '0')}:${this.minute
            .toString()
            .padStart(2, '0')}`
    }

    private _initWithCurrentTime() {
        const currentTime = new Date()
        this.hour = currentTime.getHours()
        this.minute = currentTime.getMinutes()
    }

    private _initWithString(time: string) {
        const [hour, minute] = time.split(':').map(Number)
        this.hour = hour
        this.minute = minute
    }

    private _initWithHourMinute(hour: number, minute: number) {
        this.hour = hour
        this.minute = minute
    }

    private _initWithDate(date: Date) {
        this.hour = date.getHours()
        this.minute = date.getMinutes()
    }
}
