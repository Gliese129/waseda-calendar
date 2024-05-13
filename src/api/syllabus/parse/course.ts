import { Course } from '@/model/course.ts'
import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'

const getCoursesList = (html: string) => {
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
            .map((t) => t.trim())
        course.department = cells.eq(4).text()
        course.addschedules(
            full2Half(cells.eq(5).html()?.replace(/<br>/g, '\n') || ''),
            full2Half(cells.eq(6).html()?.replace(/<br>/g, '\n') || ''),
            full2Half(cells.eq(7).html()?.replace(/<br>/g, '\n') || '')
        )
        course.setUrl(cells.eq(2).find('a').attr('onclick') || '')
        courses.push(course)
    })
    return courses
}

const getCourseDetail = (html: string, course: Course) => {
    let $ = load(html)
    let courseTable = $('.ct-sirabasu').first().children()
    let syllabusTable = $('.ct-sirabasu').eq(1).children()
    course.credits = parseInt(courseTable.children().eq(4).children().eq(5).text(), 10)
    course.campus = courseTable.children().eq(5).children().eq(3).text()
    course.textbook = syllabusTable.children().eq(6).children().eq(1).text()
    course.departmentFull = courseTable.children().eq(0).children().eq(3).text()
    return course
}

export { getCoursesList, getCourseDetail }
