import { departmentPath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type {
  IDepartmentListReq,
  IDepartmentReq,
  IDepartmentResp,
} from './types'

// 创建部门服务实例
const departmentSvc = createSvcRequest(departmentPath)

/**
 * 获取部门列表
 * @param params 查询参数
 */
export function getDepartmentListSvc(params: IDepartmentListReq) {
  return departmentSvc.POST<NetResponse<IDepartmentResp[]>>({
    url: '/list',
    data: params,
  })
}

/**
 * 获取部门详情
 * @param id 部门ID
 */
export function getDepartmentDetailSvc(id: number) {
  return departmentSvc.GET<NetResponse<IDepartmentResp>>({
    url: `/${id}`,
  })
}

/**
 * 删除部门
 * @param id 部门ID
 */
export function deleteDepartmentSvc(id: number) {
  return departmentSvc.DELETE<NetResponse<null>>({
    url: `/${id}`,
  })
}

/**
 * 添加部门
 * @param data 部门信息
 */
export function addDepartmentSvc(data: IDepartmentReq) {
  return departmentSvc.POST<NetResponse<null>>({
    url: '',
    data,
  })
}

/**
 * 修改部门信息
 * @param id 部门ID
 * @param data 部门信息
 */
export function updateDepartmentSvc(id: number, data: IDepartmentReq) {
  return departmentSvc.PUT<NetResponse<null>>({
    url: `/${id}`,
    data,
  })
}
