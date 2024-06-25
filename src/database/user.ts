export const updateUserInfoQuery = `
    UPDATE users
    SET display_language = ?, search_language = ?, course_notification = ?, department = ?, first_login = ?
    WHERE id = 1
`

export const getUserInfoQuery = `
    SELECT * FROM users
`
