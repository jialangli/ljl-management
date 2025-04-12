import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 设置API基础URL，根据实际环境配置
  timeout: 15000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      // 附加token到请求头
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response

    // 根据后端约定状态码判断请求状态
    if (data.code !== 200) {
      // 显示错误消息
      ElMessage.error(data.message || '接口请求失败')

      // 特殊错误码处理
      if (data.code === 401) {
        // token过期或无效，需要重新登录
        const userStore = useUserStore()
        userStore.resetState()
        window.location.href = '/login'
      }

      return Promise.reject(new Error(data.message || '接口请求失败'))
    }
    return data
  },
  (error) => {
    let message = ''
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          message = '身份验证失败，请重新登录'
          // 重定向到登录页
          const userStore = useUserStore()
          userStore.resetState()
          window.location.href = '/login'
          break
        case 403:
          message = '访问被拒绝'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = '网络错误'
      }
    } else {
      message = error.message || '网络连接异常'
    }

    ElMessage.error(message)
    console.error('响应错误：', error)
    return Promise.reject(error)
  }
)

// 封装请求方法
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return service(config) as unknown as Promise<T>
}

export default request
