import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'
import holiday_jp from '@holiday-jp/holiday_jp'
import { SchoolYearDate } from '@/model/date'

// holiday but still need to go to school
const _getSpecialWorkDays = (html: string): SchoolYearDate[] => {
    const $ = load(html)
    const content = $('.wp-text')
        .eq(0)
        .find('p')
        .filter((_, el) => $(el).prev().text().includes('授業を行う祝日'))
        .text()
    const dateReg = /\d{1,2}月\d{1,2}日/g
    const dates = content.match(dateReg)?.map((date) => full2Half(date))
    return dates
        ? dates.map((date) => {
            let month = parseInt(date.split('月')[0], 10)
            let day = parseInt(date.split('月')[1].replace('日', ''), 10)
            return new SchoolYearDate(month, day)
        })
        : []
}

// workday but no need to go to school
const _getSpecialHolidays = (html: string): SchoolYearDate[] => {
    const $ = load(html)
    const content = $('.wp-text')
        .eq(0)
        .find('p')
        .filter((_, el) => $(el).prev().text().includes('臨時の休業日'))
        .text()
    const dateReg = /(\d{1,2}月\d{1,2}日)/g
    const dates = content.match(dateReg)?.map((date) => full2Half(date))
    return dates
        ? dates.map((date) => {
            let month = parseInt(date.split('月')[0], 10)
            let day = parseInt(date.split('月')[1].replace('日', ''), 10)
            return new SchoolYearDate(month, day)
        })
        : []
}

const getHolidays = (html: string): SchoolYearDate[] => {
    let specialWorkDays = _getSpecialWorkDays(html).map((date) =>
        date.dateValueOf()
    )
    let specialHolidays = _getSpecialHolidays(html)

    let japanHolidays = holiday_jp.between(
        SchoolYearDate.getStartDate(),
        SchoolYearDate.getEndDate()
    )
    return japanHolidays
        .map((holiday) => new SchoolYearDate(holiday.date))
        .concat(specialHolidays)
        .filter((holiday) => !specialWorkDays.includes(holiday.dateValueOf()))
}

//
interface Quarter {
    start: SchoolYearDate
    end: SchoolYearDate
}
const getQuarters = (html: string): Quarter[] => {
    const $ = load(html)
    const content = full2Half($('.wp-text').eq(0).text())

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
        const start = content
            .match(reg.start)
            ?.map((str) => parseInt(full2Half(str), 10))
        const end = content
            .match(reg.end)
            ?.map((str) => parseInt(full2Half(str), 10))
        return {
            start: new SchoolYearDate(start!![1], start!![2]),
            end: new SchoolYearDate(end!![1], end!![2]),
        }
    })
}

export { getHolidays, getQuarters }
