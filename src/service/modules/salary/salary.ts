import { salaryPath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type {
  ISalaryListReq,
  ISalaryReq,
  ISalaryResp,
  ISalaryUpdateReq,
} from './types'

// 创建工资服务实例
const salarySvc = createSvcRequest(salaryPath)

/**
 * 获取员工工资列表
 * @param params 查询参数
 */
export function getSalaryListSvc(params: ISalaryListReq) {
  return salarySvc.POST<NetResponse<ISalaryResp[]>>({
    url: '/list',
    data: params,
  })
}

/**
 * 添加薪资记录
 * @param data 薪资信息
 */
export function addSalarySvc(data: ISalaryReq) {
  return salarySvc.POST<NetResponse<null>>({
    url: '',
    data,
  })
}

/**
 * 修改用户工资信息
 * @param id 工资记录ID
 * @param data 薪资信息
 */
export function updateSalarySvc(id: number, data: ISalaryUpdateReq) {
  return salarySvc.PUT<NetResponse<null>>({
    url: `/${id}`,
    data,
  })
}

/**
 * 获取个人工资列表
 * @param params 查询参数
 */
export function getPersonalSalaryListSvc(params: ISalaryListReq) {
  return salarySvc.POST<NetResponse<ISalaryResp>>({
    url: '/personal',
    data: params,
  })
}
