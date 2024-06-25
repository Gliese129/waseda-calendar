export const addCourseQuery = `
    INSERT INTO courses (
        code, name, teachers, schedules, academic_year, campus, department, credits, url, textbook
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

export const deleteCourseByCodeQuery = `
    DELETE FROM courses
    WHERE code = ?
`

export const deleteAllCoursesQuery = `
    DELETE FROM courses
`

export const getAllCoursesQuery = `
    SELECT * FROM courses
`
