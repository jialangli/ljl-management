// 请假列表请求参数
export interface ILeaveListReq {
  userId?: number
  status?: number // 0待审批 1已通过 2已拒绝
  type?: number // 0病假 1事假 2年假
  startTime?: string
  endTime?: string
  pageNum?: number
  pageSize?: number
}

// 请假响应
export interface ILeaveRequestResp {
  id: number
  userId: number
  username: string
  realName: string
  startTime: string
  endTime: string
  type: number // 0病假 1事假 2年假
  reason: string
  status: number // 0待审批 1已通过 2已拒绝
  createTime: string
}

// 请假申请请求
export interface ILeaveRequestReq {
  type: number // 0病假 1事假 2年假
  startTime: string
  endTime: string
  reason: string
}

// 请假状态更新请求
export interface ILeaveStatusUpdateReq {
  status: number // 0待审批 1已通过 2已拒绝
}

// 分页响应，从用户模块导入
