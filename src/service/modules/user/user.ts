import { userPath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type { IAddUserReq, IUpdateUserReq, IUserInfoResp, IUserListReq } from './types'

// 创建用户服务实例
const userSvc = createSvcRequest(userPath)

/**
 * 获取用户列表
 * @param params 查询参数
 */
export function getUserListSvc(params: IUserListReq) {
  return userSvc.POST<NetResponse<IUserInfoResp[]>>({
    url: '/list',
    data: params
  })
}

/**
 * 获取用户详情
 * @param id 用户ID
 */
export function getUserDetailSvc(id: number) {
  return userSvc.GET<NetResponse<IUserInfoResp>>({
    url: `/${id}`
  })
}

/**
 * 删除用户
 * @param id 用户ID
 */
export function deleteUserSvc(id: number) {
  return userSvc.DELETE<NetResponse<null>>({
    url: `/${id}`
  })
}

/**
 * 添加用户
 * @param data 用户信息
 */
export function addUserSvc(data: IAddUserReq) {
  return userSvc.POST<NetResponse<null>>({
    url: '',
    data
  })
}

/**
 * 更新用户信息
 * @param id 用户ID
 * @param data 用户信息
 */
export function updateUserSvc(id: number, data: IUpdateUserReq) {
  return userSvc.PUT<NetResponse<null>>({
    url: `/${id}`,
    data
  })
}

/**
 * 上传用户头像
 * @param formData 包含头像文件的FormData
 */
export function uploadAvatarSvc(formData: FormData) {
  return userSvc.POST<NetResponse<string>>({
    url: '/avatar',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取用户头像
 * @param id 用户ID
 */
export function getUserAvatarSvc(path: string) {
  return createSvcRequest().GET<Blob>({
    url: path,
    responseType: 'blob'
  })
}
