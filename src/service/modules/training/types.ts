// 培训列表请求参数
export interface ITrainingListReq {
  title?: string
  creator?: string
  pageNum?: number
  pageSize?: number
}

// 培训响应
export interface ITrainingResp {
  id: number
  creator: string
  title: string
  content: string
  startTime: string
  endTime: string
  participants: string[]
  createTime: string
}

// 培训请求（添加/修改）
export interface ITrainingReq {
  title: string
  content: string
  startTime: string
  endTime: string
  participants: string
}
