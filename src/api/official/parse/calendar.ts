import { SimpleTime } from './../../../model/date'
import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'
import holiday_jp from '@holiday-jp/holiday_jp'
import { AcademicDate } from '@/model/date'

// holiday but still need to go to school
const _getSpecialWorkDays = (html: string): AcademicDate[] => {
    const $ = load(html)
    const content = $('.wp-text')
        .find('p')
        .filter((_, el) => $(el).prev().text().includes('授業を行う祝日'))
        .text()
    const dateReg = /\d{1,2}月\d{1,2}日/g
    const dates = content.match(dateReg)?.map((date) => full2Half(date))
    return dates
        ? dates.map((date) => {
            let month = parseInt(date.split('月')[0], 10)
            let day = parseInt(date.split('月')[1].replace('日', ''), 10)
            return new AcademicDate(month, day)
        })
        : []
}

// workday but no need to go to school
const _getSpecialHolidays = (html: string): AcademicDate[] => {
    const $ = load(html)
    const content = $('.wp-text')
        .find('p')
        .filter((_, el) => $(el).prev().text().includes('臨時の休業日'))
        .text()
    const dateReg = /(\d{1,2}月\d{1,2}日)/g
    const dates = content.match(dateReg)?.map((date) => full2Half(date))
    return dates
        ? dates.map((date) => {
            let month = parseInt(date.split('月')[0], 10)
            let day = parseInt(date.split('月')[1].replace('日', ''), 10)
            return new AcademicDate(month, day)
        })
        : []
}

const getHolidays = (html: string): AcademicDate[] => {
    let specialWorkDays = _getSpecialWorkDays(html).map((date) => date.dateValueOf())
    let specialHolidays = _getSpecialHolidays(html)

    let japanHolidays = holiday_jp.between(
        AcademicDate.getStartDate(),
        AcademicDate.getEndDate()
    )
    return japanHolidays
        .map((holiday) => new AcademicDate(holiday.date))
        .concat(specialHolidays)
        .filter((holiday) => !specialWorkDays.includes(holiday.dateValueOf()))
}

//
interface Quarter {
    start: AcademicDate
    end: AcademicDate
}
const getQuarters = (html: string): Quarter[] => {
    const $ = load(html)
    const content = full2Half($('.wp-text').text())

    const dateReg = [
        {
            start: /春学期開始日:(\d{1,2})月(\d{1,2})日/,
            end: /春クォーター授業終了:(\d{1,2})月(\d{1,2})日/,
        },
        {
            start: /夏クォーター授業開始:(\d{1,2})月(\d{1,2})日/,
            end: /春学期授業終了:(\d{1,2})月(\d{1,2})日/,
        },
        {
            start: /秋学期開始日:(\d{1,2})月(\d{1,2})日/,
            end: /秋クォーター授業終了:(\d{1,2})月(\d{1,2})日/,
        },
        {
            start: /冬クォーター授業開始:(\d{1,2})月(\d{1,2})日/,
            end: /秋学期授業終了:(\d{1,2})月(\d{1,2})日/,
        },
    ]

    return dateReg.map((reg) => {
        const start = content.match(reg.start)?.map((str) => parseInt(full2Half(str), 10))
        const end = content.match(reg.end)?.map((str) => parseInt(full2Half(str), 10))
        return {
            start: new AcademicDate(start!![1], start!![2]),
            end: new AcademicDate(end!![1], end!![2]),
        }
    })
}

const getPeriods = (html: string) => {
    const $ = load(html)
    const content = $('.wp-text')
        .find('table')
        .find('tr')
        .slice(2)
        .map((_, el) => $(el).find('td').eq(1).text())
        .toArray()
    const periodReg = /(\d{1,2}:\d{2})～(\d{1,2}:\d{2})/g
    return content.map((str) => {
        const periods = str.match(periodReg)?.map((period) => period.split('～'))[0]
        return {
            start: new SimpleTime(periods!![0]),
            end: new SimpleTime(periods!![1]),
        }
    })
}

export { getHolidays, getQuarters, getPeriods }
