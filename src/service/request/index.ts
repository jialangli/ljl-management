import { router } from '@/router'
import { localCache } from '@/utils/cache/cache'
import { Account_TOKEN } from '@/utils/cache/keys'
import { ElMessage } from 'element-plus'
import { BASE_URL, TIME_OUT } from '../config/index.ts'
import NetRequest from './request'

// 创建全局工厂实例
function createSvcRequest(prefix = '') {
  return new NetRequest({
    baseURL: BASE_URL + prefix, // 动态拼接 baseURL
    timeout: TIME_OUT,
    withCredentials: false,
    interceptors: {
      // 每一个请求都自动携带 token
      requestSuccessFn: config => {
        const token = localCache.getCache(Account_TOKEN)
        if (config.headers && token) {
          config.headers.Authorization = 'Bearer ' + token
        }
        return config
      },

      // 处理服务器错误
      responseSuccessFn: res => {
        // 如果token过期 ,跳转登录页面并清除token
        if (res.data?.code === 401) {
          ElMessage({ type: 'info', message: '登录信息过期,请重新登录!!!' })
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          router.push('/login')
        } else if (res.data?.code !== 200) {
          const message = res.data?.message || '服务器请求错误!!!'
          ElMessage({ type: 'error', message: message })
          console.error(`Error: ${message}`)
          return Promise.reject(new Error(message)) as never
        }
        return res
      },

      // 处理网络错误
      responseFailureFn: err => {
        const message = err.response?.data?.message || '网络错误，请稍后重试!!!'
        ElMessage({ type: 'error', message })
        console.error('Network Error:', err)
        return Promise.reject(err) // 抛出网络错误
      }
    }
  })
}

export default createSvcRequest
