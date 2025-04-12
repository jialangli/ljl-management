import request from '@/utils/request'
import type { LoginParams, LoginResult, UserInfo, ApiResponse } from '@/types/user'

// 用户登录
export function login(data: LoginParams) {
  return request<ApiResponse<LoginResult>>({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request<ApiResponse<UserInfo>>({
    url: '/user/info',
    method: 'get'
  })
}

// 退出登录
export function logout() {
  return request<ApiResponse>({
    url: '/user/logout',
    method: 'post'
  })
}

// 修改密码
export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request<ApiResponse>({
    url: '/user/password',
    method: 'put',
    data
  })
}

// 更新用户信息
export function updateUserInfo(data: Partial<UserInfo>) {
  return request<ApiResponse>({
    url: '/user/info',
    method: 'put',
    data
  })
}
