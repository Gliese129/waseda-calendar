export const initTablesQuery = `
    CREATE TABLE IF NOT EXISTS courses (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        teachers TEXT NOT NULL,
        schedules TEXT NOT NULL,
        academic_year INTEGER NOT NULL,
        campus TEXT NOT NULL,
        department TEXT NOT NULL,
        credits INTEGER NOT NULL,
        url TEXT,
        textbook TEXT
        description TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT,
        display_language TEXT,
        search_language TEXT,
        course_notification INTEGER,
        department TEXT,
        first_login INTEGER,
        avatar TEXT,
        background TEXT,
        UNIQUE(id, name)
    );
    CREATE TABLE IF NOT EXISTS periods (
        ID INTEGER PRIMARY KEY,
        start TEXT NOT NULL,
        end TEXT NOT NULL
    );
`

export const initUserQuery = `
    INSERT OR IGNORE INTO users (id, name, display_language, search_language, course_notification, department, first_login, avatar, background)
    VALUES (1, '', 'en', 'en', 0, '', 1, '', '')
`
