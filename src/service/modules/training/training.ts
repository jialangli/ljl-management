import { trainingPath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'

import type { ITrainingListReq, ITrainingReq, ITrainingResp } from './types'

// 创建培训服务实例
const trainingSvc = createSvcRequest(trainingPath)

/**
 * 获取培训列表
 * @param params 查询参数
 */
export function getTrainingListSvc(params: ITrainingListReq) {
  return trainingSvc.POST<NetResponse<ITrainingResp[]>>({
    url: '/list',
    data: params,
  })
}

/**
 * 查看培训详情
 * @param id 培训ID
 */
export function getTrainingDetailSvc(id: number) {
  return trainingSvc.GET<NetResponse<ITrainingResp>>({
    url: `/${id}`,
  })
}

/**
 * 添加培训信息
 * @param data 培训信息
 */
export function addTrainingSvc(data: ITrainingReq) {
  return trainingSvc.POST<NetResponse<null>>({
    url: '',
    data,
  })
}

/**
 * 修改培训信息
 * @param id 培训ID
 * @param data 培训信息
 */
export function updateTrainingSvc(id: number, data: ITrainingReq) {
  return trainingSvc.PUT<NetResponse<null>>({
    url: `/${id}`,
    data,
  })
}

/**
 * 删除培训记录
 * @param id 培训ID
 */
export function deleteTrainingSvc(id: number) {
  return trainingSvc.DELETE<NetResponse<null>>({
    url: `/${id}`,
  })
}
