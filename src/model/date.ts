class SimpleDate {
    public month: number
    public day: number
    public constructor(month: number, day: number) {
        this.month = month
        this.day = day
    }

    public valueOf(): number {
        return this.month * 100 + this.day
    }

    public toString(): string {
        return `${this.month}/${this.day}`
    }
}

export class SchoolYearDate {
    public static newYearStart = new SimpleDate(4, 1)

    public static getSchoolYear(_date = null): number {
        let date: any = _date || new Date()
        let simpleDate = new SimpleDate(date.getMonth() + 1, date.getDate())
        if (simpleDate < this.newYearStart) {
            return date.getFullYear() - 1
        } else {
            return date.getFullYear()
        }
    }
    public static getStartDate(): Date {
        return new Date(
            this.getSchoolYear(),
            this.newYearStart.month - 1,
            this.newYearStart.day
        )
    }
    public static getEndDate(): Date {
        let newDate = new Date(
            this.getSchoolYear() + 1,
            this.newYearStart.month - 1,
            this.newYearStart.day
        )
        newDate = new Date(newDate.getTime() - 24 * 60 * 60 * 1000)
        return newDate
    }
    //
    public schoolYear: number
    public date: SimpleDate

    public constructor(...data: any) {
        this.schoolYear = 0
        this.date = new SimpleDate(0, 0)

        if (data.length === 0) {
            this._realDateConstructor(new Date())
        } else if (data.length === 1 && data[0] instanceof Date) {
            this._realDateConstructor(data[0])
        } else if (data.length === 3 && typeof data[0] === 'number') {
            this._schoolYearFullConstructor(data[0], data[1], data[2])
        } else if (data.length === 2 && typeof data[0] === 'number') {
            this._schoolYearConstructor(data[0], data[1])
        } else {
            throw new Error('Invalid arguments')
        }
    }

    public getAdjustedDate(): Date {
        const month = this.date.month
        const day = this.date.day
        if (this.date < SchoolYearDate.newYearStart) {
            return new Date(this.schoolYear - 1, month - 1, day)
        } else {
            return new Date(this.schoolYear, month - 1, day)
        }
    }

    public toString(isSchoolYear = true): string {
        if (isSchoolYear) return `${this.date.toString()}(${this.schoolYear})`
        return this.getAdjustedDate().toLocaleDateString()
    }

    public valueOf(): number {
        return this.getAdjustedDate().valueOf()
    }
    public dateValueOf(): number {
        return this.date.valueOf()
    }
    public equals(other: SchoolYearDate): boolean {
        return (
            this.schoolYear === other.schoolYear &&
      this.date.valueOf() === other.date.valueOf()
        )
    }
    public isBetween(start: SchoolYearDate, end: SchoolYearDate): boolean {
        return this.valueOf() >= start.valueOf() && this.valueOf() <= end.valueOf()
    }
    public isBetweenDate(start: Date, end: Date): boolean {
        return (
            this.getAdjustedDate().valueOf() >= start.valueOf() &&
      this.getAdjustedDate().valueOf() <= end.valueOf()
        )
    }

    // reload constructors
    private _schoolYearFullConstructor(year: number, month: number, day: number) {
        this.schoolYear = year
        this.date = new SimpleDate(month, day)
    }
    private _realDateConstructor(date: Date) {
        this.schoolYear = date.getFullYear()
        this.date = new SimpleDate(date.getMonth() + 1, date.getDate())
        if (this.date < SchoolYearDate.newYearStart) {
            this.schoolYear--
        }
    }
    private _schoolYearConstructor(month: number, day: number) {
        this.schoolYear = SchoolYearDate.getSchoolYear()
        this.date = new SimpleDate(month, day)
        if (this.date < SchoolYearDate.newYearStart) {
            this.schoolYear--
        }
    }
}
