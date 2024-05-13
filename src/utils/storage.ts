const searchLocalBeforeNetwork = async <T>(
    key: string,
    func: () => Promise<T>,
    forceRefresh = false
): Promise<T> => {
    // if not force, try to get from local storage
    if (!forceRefresh && localStorage.getItem(key)) {
        return JSON.parse(localStorage.getItem(key) || '{}')
    }

    // if not found or force, get from network
    const data = await func()
    localStorage.setItem(key, JSON.stringify(data))
    return data
}

const saveLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
}

const getLocal = (key: string) => {
    if (!localStorage.getItem(key)) return null
    return JSON.parse(localStorage.getItem(key) || '')
}

export { searchLocalBeforeNetwork, saveLocal, getLocal }
