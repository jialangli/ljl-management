// 部门列表请求参数
export interface IDepartmentListReq {
  name?: string
  leaderId?: number
  pageNum?: number
  pageSize?: number
}

// 部门响应
export interface IDepartmentResp {
  id: number
  name: string
  leaderId: number
  leaderName: string
  createTime: string
  updateTime: string
}

// 部门请求（添加/修改）
export interface IDepartmentReq {
  name: string
  leaderId?: number
}

// 分页响应，从用户模块导入
