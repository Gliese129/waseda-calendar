import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

const isWeb = () => {
    return Capacitor.getPlatform() === 'web'
}
//
const _saveLocalWeb = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data))
}
const _saveLocalNative = async (key: string, data: any) => {
    await Preferences.set({ key, value: JSON.stringify(data) })
}

const saveLocal = async (key: string, data: any) => {
    if (isWeb()) {
        _saveLocalWeb(key, data)
    } else {
        await _saveLocalNative(key, data)
    }
}
//
const _getLocalWeb = (key: string) => {
    if (!localStorage.getItem(key)) return null
    return JSON.parse(localStorage.getItem(key) || '')
}
const _getLocalNative = async (key: string) => {
    const { value } = await Preferences.get({ key })
    if (!value) return null
    return JSON.parse(value)
}

const getLocal = async (key: string) => {
    if (isWeb()) {
        return _getLocalWeb(key)
    } else {
        return await _getLocalNative(key)
    }
}

const searchLocalBeforeNetwork = async <T>(
    key: string,
    func: () => Promise<T>,
    forceRefresh = false
): Promise<T> => {
    // if not force, try to get from local storage
    if (!forceRefresh && (await getLocal(key))) {
        return await getLocal(key)
    }

    // if not found or force, get from network
    const data = await func()
    saveLocal(key, data)
    return data
}

export { searchLocalBeforeNetwork, saveLocal, getLocal }
