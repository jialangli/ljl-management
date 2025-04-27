import { leavePath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type {
  ILeaveListReq,
  ILeaveRequestReq,
  ILeaveRequestResp,
  ILeaveStatusUpdateReq
} from './types'

// 创建请假服务实例
const leaveSvc = createSvcRequest(leavePath)

/**
 * 获取请假列表
 * @param params 查询参数
 */
export function getLeaveListSvc(params?: ILeaveListReq) {
  return leaveSvc.POST<NetResponse<ILeaveRequestResp[]>>({
    url: '/list',
    data: params
  })
}

/**
 * 获取个人请假列表
 * @param params 查询参数
 */
export function getPersonalLeaveListSvc(params: ILeaveListReq) {
  return leaveSvc.POST<NetResponse<ILeaveRequestResp[]>>({
    url: '/personal',
    data: params
  })
}

/**
 * 提交请假申请
 * @param data 请假信息
 */
export function submitLeaveRequestSvc(data: ILeaveRequestReq) {
  return leaveSvc.POST<NetResponse<null>>({
    url: '',
    data
  })
}

/**
 * 修改请假信息
 * @param id 请假记录ID
 * @param data 请假状态
 */
export function updateLeaveStatusSvc(id: number, data: ILeaveStatusUpdateReq) {
  return leaveSvc.PUT<NetResponse<null>>({
    url: `/${id}`,
    data
  })
}
/**
 * 删除请假信息
 * @param id 请假记录ID
 */
export function deleteLeaveSvc(id: number) {
  return leaveSvc.DELETE<NetResponse<null>>({
    url: `/${id}`
  })
}
