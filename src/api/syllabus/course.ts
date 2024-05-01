import Http from './http'

export interface SearchParams {
    keyword: string | null
    term: number | null
    dayOfWeek: number | null
    period: number | null
    pageId: number
}

import { getCoursesList } from './parse/course'
const fetchCoursesList = async (form: SearchParams) => {
    const formData: any = {}
    if (form.keyword) formData['keyword'] = form.keyword
    if (form.term) formData['p_gakki'] = form.term
    if (form.dayOfWeek) formData['p_youbi'] = form.dayOfWeek
    if (form.period) formData['p_jigen'] = form.period
    formData['ControllerParameters'] = 'JAA103SubCon'
    formData['p_number'] = '10'
    if (form.pageId) formData['p_page'] = form.pageId

    let html: string = await Http.postForm('/index.php', formData)
    return getCoursesList(html)
}

export { fetchCoursesList }
