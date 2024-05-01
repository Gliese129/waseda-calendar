const searchLocalBeforeNetwork = async (key: string, func: Function) => {
    return async () => {
        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key) || '')
        }
        const data = await func()
        localStorage.setItem(key, JSON.stringify(data))
        return data
    }
}
