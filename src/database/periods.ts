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
