// holidays & periods
import Http from './http'
import { getHolidays, getPeriods, getQuarters } from './parse/calendar'

const academicCalendarSubUrl =
  '/top/about/work/organizations/academic-affairs-division/academic-calendar'

// all date are parsed as string in the format of 'mm/dd'
const fetchHolidays = async () => {
    let html: string = await Http.get(academicCalendarSubUrl)
    return getHolidays(html)
}

//
const fetchQuarters = async () => {
    let html: string = await Http.get(academicCalendarSubUrl)
    return getQuarters(html)
}

const fetchPeriods = async () => {
    let html: string = await Http.get(academicCalendarSubUrl)
    return getPeriods(html)
}

export { fetchHolidays, fetchQuarters, fetchPeriods }
