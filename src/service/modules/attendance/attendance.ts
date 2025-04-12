import { attendancePath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type {
  IAttendanceListReq,
  IAttendanceReq,
  IAttendanceResp,
  IClockInReq,
} from './types'

// 创建考勤服务实例
const attendanceSvc = createSvcRequest(attendancePath)

/**
 * 获取考勤列表
 * @param params 查询参数
 */
export function getAttendanceListSvc(params: IAttendanceListReq) {
  return attendanceSvc.POST<NetResponse<IAttendanceResp[]>>({
    url: '/list',
    data: params,
  })
}

/**
 * 查看个人考勤列表
 * @param params 查询参数
 */
export function getPersonalAttendanceSvc(params: IAttendanceReq) {
  return attendanceSvc.POST<NetResponse<IAttendanceResp[]>>({
    url: '/personal',
    data: params,
  })
}

/**
 * 提交考勤信息（打卡）
 * @param data 打卡信息
 */
export function clockInSvc(data: IClockInReq) {
  return attendanceSvc.POST<NetResponse<null>>({
    url: '',
    data,
  })
}
