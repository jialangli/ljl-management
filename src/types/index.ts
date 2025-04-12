export * from './login'

// 用户类型
export interface User {
  id: number
  username: string
  password: string
  role: string
  createTime: string
  departmentId: number
  updateTime: string
  email: string
  realName: string
  phone: string
  avatar: string
}

// 部门类型
export interface Department {
  id: number
  name: string
  leaderId: number
  zhiwei: string
}

// 培训类型
export interface Training {
  id: number
  creator: string
  title: string
  content: string
  startTime: string
  endTime: string
  participants: string
}

// 考勤类型
export interface Attendance {
  id: number
  userId: number
  clockIn: string
  type: '上班' | '下班'
  status: '正常' | '迟到' | '早退'
  addTime: string
}

// 薪资类型
export interface Salary {
  id: number
  userId: number
  baseSalary: number
  bonus: number
  deduction: number
  month: string
  finalSalary: number
}

// 请假类型
export interface LeaveRequest {
  id: number
  userId: number
  startTime: string
  endTime: string
  type: '病假' | '事假'
  reason: string
  status: '审批中' | '已通过' | '已拒绝'
}

// Token类型
export interface Token {
  id: number
  userId: number
  role: string
  token: string
  addTime: string
  expiratedTime: string
}
