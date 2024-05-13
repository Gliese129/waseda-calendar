import { load } from 'cheerio'
import { full2Half } from '@/utils/locale'

interface Department {
    title: string
    value: string
}

const getDepartments = (html: string): Department[] => {
    const $ = load(html)
    const options = $('select[name="p_gakubu"] option').filter((_, option) => {
        return $(option).val() !== ''
    })
    const departments: Department[] = []
    options.each((_, option) => {
        departments.push({
            title: full2Half($(option).text()),
            value: $(option).val() as string,
        })
    })
    return departments
}

export { getDepartments }
