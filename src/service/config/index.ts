// 1.区分开发环境和生产环境
// export const BASE_URL = 'http://coderwhy.dev:8000'
// export const BASE_URL = 'http://codercba.prod:8000'

// 2.代码逻辑判断, 判断当前环境
// vite默认提供的环境变量
// console.log(import.meta.env.MODE)
// console.log(import.meta.env.DEV) // 是否开发环境
// console.log(import.meta.env.PROD) // 是否生产环境
// console.log(import.meta.env.SSR) // 是否是服务器端渲染(server side render)

let BASE_URL = ''
if (import.meta.env.PROD) {
  // 生产环境
  BASE_URL = 'http://47.115.160.54:28080'
} else {
  // 开发环境
  BASE_URL = 'http://47.115.160.54:28080'
}

// console.log(BASE_URL)

// 3.通过创建.env文件直接创建变量
// console.log(import.meta.env.VITE_URL)

// 设置更短的超时时间
export const TIME_OUT = 10000
export { BASE_URL }
