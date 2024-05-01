import { Course } from '@/model/course.ts'
import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'

const getCoursesList = async (html: string) => {
    let $ = load(html)
    let table = $('.ct-vh').first()
    let courses: Course[] = []

    let rows = table.find('tr').filter(':not(.c-vh-title)')
    rows.each((_, row) => {
        let cells = $(row).children('td')
        let course = new Course(
            full2Half(cells.eq(1).text()),
            full2Half(cells.eq(2).find('a').text())
        )
        course.teachers = full2Half(cells.eq(3).text())
            .split('/')
            .map((t) => full2Half(t))
        course.department = cells.eq(4).text()
        course.addTimePlace(
            full2Half(cells.eq(5).html()?.replace(/<br>/g, '\n') || ''),
            full2Half(cells.eq(6).html()?.replace(/<br>/g, '\n') || ''),
            full2Half(cells.eq(7).html()?.replace(/<br>/g, '\n') || '')
        )
        course.setUrl(cells.eq(2).find('a').attr('onclick') || '')
        courses.push(course)
    })
    console.log(courses)
    return courses
}

export { getCoursesList }
