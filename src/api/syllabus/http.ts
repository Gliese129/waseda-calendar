import { CapacitorHttp } from '@capacitor/core'

const baseUrl = 'https://www.wsl.waseda.jp/syllabus'

const get = async (url: string, params: any): Promise<any> => {
    const options = {
        url: baseUrl + url,
        params: params,
    }
    const response = await CapacitorHttp.get(options)
    return response.data
}

const post = async (url: string, data: any): Promise<any> => {
    const options = {
        url: baseUrl + url,
        data: data,
    }
    const response = await CapacitorHttp.post(options)
    return response.data
}

const postForm = async (url: string, formData: any): Promise<any> => {
    const options = {
        url: baseUrl + url,
        data: formData,
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
