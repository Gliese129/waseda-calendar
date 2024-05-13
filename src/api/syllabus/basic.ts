// basic information of syllabus
import Http from './http'
import { getDepartments } from './parse/basic'

const fetchDepartments = async () => {
    let html: string = await Http.get(`/JAA101.php`)
    return getDepartments(html)
}

export { fetchDepartments }
