// course information from syllabus
import type { Course } from '@/model/course'
import Http from './http'

export interface SearchParams {
    keyword: string | null
    name: string | null
    semester: number | null
    weekday: number | null
    period: number | null
    pageId: number
    departmentId: string | null
}

import { getCourseDetail, getCoursesList } from './parse/course'
const fetchCoursesList = async (form: SearchParams) => {
    const formData: any = {}
    if (form.keyword) formData['keyword'] = form.keyword
    if (form.name) formData['kamoku'] = form.name
    if (form.semester) formData['p_gakki'] = form.semester
    if (form.weekday) formData['p_youbi'] = form.weekday
    if (form.period) formData['p_jigen'] = form.period
    if (form.departmentId) formData['p_gakubu'] = form.departmentId
    formData['ControllerParameters'] = 'JAA103SubCon'
    formData['p_number'] = 20
    if (form.pageId) formData['p_page'] = form.pageId

    let html: string = await Http.postForm('/index.php', formData)
    return getCoursesList(html)
}

const fetchCoursesDetail = async (course: Course) => {
    let url = '/JAA104.php?pKey=' + course.key
    let html: string = await Http.get(url)
    getCourseDetail(html, course)
    console.log('detailed course info: ', course)
    return course
}

export { fetchCoursesList, fetchCoursesDetail }
