// 考勤列表请求参数
export interface IAttendanceListReq {
  userId?: number
  startDate?: string
  endDate?: string
  type?: string // 上班/下班
  status?: string // 正常/迟到/早退
  pageNum?: number
  pageSize?: number
}

// 个人考勤请求参数
export interface IAttendanceReq {
  userId?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}

// 考勤响应
export interface IAttendanceResp {
  id: number
  userId: number
  username: string
  realName: string
  clockIn: string
  type: string
  status: string
  createTime: string
}

// 打卡请求
export interface IClockInReq {
  type: string // 上班/下班
}

// 分页响应，从用户模块导入
