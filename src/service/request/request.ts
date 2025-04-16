// src/service/request.ts

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

/**
 *  对 axios 包的封装实现
 * 1. axios请求实例化
 * 2. RESTful 风格封装
 * 3. 拦截器精细控制 > 全局拦截器  > 实例拦截器  > 请求拦截器
 * 4. 响应结果类型泛型化处理
 */

// 继承 AxiosRequestConfig
interface NetRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: {
    requestSuccessFn?: (config: AxiosRequestConfig) => any
    requestFailureFn?: (err: any) => any
    responseSuccessFn?: (config: T) => T
    responseFailureFn?: (err: any) => any
  }
}

class NetRequest {
  instance: AxiosInstance

  // request 实例
  constructor(config: NetRequestConfig) {
    this.instance = axios.create(config)

    //全局请求拦截器
    this.instance.interceptors.request.use(
      config => {
        // 成功拦截
        return config
      },
      err => err
    )

    //局部拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailureFn
    )

    // 全局响应拦截器
    this.instance.interceptors.response.use(
      res => {
        return res.data
      },
      err => err
    )
  }

  // 网络请求
  protected request<T>(config: NetRequestConfig<T>): Promise<T> {
    if (config.interceptors?.requestSuccessFn) {
      // 单次请求拦截器
      config = config.interceptors.requestSuccessFn(config)
    }

    return new Promise<T>((resolve, reject) => {
      //单次响应拦截器
      this.instance
        .request<any, T>(config)
        .then(res => {
          // 第二个参数才是响应参数
          if (config.interceptors?.responseSuccessFn) {
            config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }

  GET<T = any>(config: NetRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }

  POST<T = any>(config: NetRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }

  PUT<T = any>(config: NetRequestConfig<T>) {
    return this.request({ ...config, method: 'PUT' })
  }

  DELETE<T = any>(config: NetRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
}

export default NetRequest
