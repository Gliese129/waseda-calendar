import type { SimpleTime } from '@/model/date'

export const addPeriodsQuery = `
    INSERT INTO periods (id, start, end)
    VALUES ($1, $2, $3)
`

export const deleteAllPeriodsQuery = `
    DELETE FROM periods
`

export const getAllPeriodsQuery = `
    SELECT * FROM periods
`

export const generateAddPeriodsBatchQuery = (
    periods: {
        start: SimpleTime
        end: SimpleTime
    }[]
) => {
    let query = `INSERT INTO periods (id, start, end) VALUES `
    const data = [] as any[]
    periods.forEach((period, idx) => {
        query += `(\$${idx * 3 + 1}, \$${idx * 3 + 2}, \$${idx * 3 + 3}) ${
            idx === periods.length - 1 ? ';' : ','
        }`
        data.push(idx, period.start.toString(), period.end.toString())
    })
    return { query, data }
}
