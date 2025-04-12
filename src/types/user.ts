// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  realName?: string
  avatar?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  role: string
  createTime?: string
  updateTime?: string
}

// 登录参数接口
export interface LoginParams {
  username: string
  password: string
}

// 登录返回结果接口
export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
