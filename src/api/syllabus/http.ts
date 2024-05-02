import { Capacitor, CapacitorHttp } from '@capacitor/core'
import axios from 'axios'

const baseUrl = 'https://www.wsl.waseda.jp/syllabus'
// axios for web
const instance = axios.create({
    baseURL: '/syllabus',
    headers: {
        'Allow-Control-Allow-Origin': '*',
    },
})
const isWeb = (): boolean => {
    return Capacitor.getPlatform() === 'web'
}
instance.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        console.error(error)
        return Promise.reject(error)
    }
)

const get = async (url: string, params: any = {}): Promise<any> => {
    if (isWeb()) return await instance.get(url, { params })
    const options = {
        url: baseUrl + url,
        params: params,
    }
    const response = await CapacitorHttp.get(options)
    return response.data
}

const post = async (url: string, data: any): Promise<any> => {
    if (isWeb()) return await instance.post(url, data)
    const options = {
        url: baseUrl + url,
        data: data,
    }
    const response = await CapacitorHttp.post(options)
    return response.data
}

const postForm = async (url: string, data: any): Promise<any> => {
    if (isWeb()) {
        let formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        return await instance.post(url, formData)
    }
    const options = {
        url: baseUrl + url,
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    const response = await CapacitorHttp.post(options)
    return response.data
}

export default {
    get,
    post,
    postForm,
}
