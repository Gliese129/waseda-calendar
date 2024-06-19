import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'
import { departments } from '@/assets/departments'

interface Department {
    name: string
    abbr: string
    value: string
}

const getDepartments = (html: string): Department[] => {
    const $ = load(html)
    const options = $('select[name="p_gakubu"] option').filter((_, option) => {
        return $(option).val() !== ''
    })
    const result: Department[] = []
    options.each((_, option) => {
        let abbr = full2Half($(option).text())
        let name = departments.find((department) => department.abbr === abbr)?.name || abbr
        result.push({
            name,
            abbr,
            value: $(option).val() as string,
        })
    })
    return result
}

export { getDepartments }
