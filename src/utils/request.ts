import axios, { type AxiosRequestConfig } from 'axios'

import { requestEventBus } from '@/event-bus'

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem('token') || ''
    requestEventBus.emit({ type: 'request' })
    return config
  },
  (error) => {
    requestEventBus.emit({ type: 'requestError', error })
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    requestEventBus.emit({ type: 'response', data: response.data })
    return response
  },
  (error) => {
    const code = error.response?.data?.code
    requestEventBus.emit({ type: 'responseError', error, code })
    return Promise.reject(error)
  },
)

export async function request<T = any>(config: AxiosRequestConfig) {
  const response = await axiosInstance.request<ResponseBody<T>>(config)
  return response.data
}

export default request
