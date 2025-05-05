// 工资列表请求参数
export interface ISalaryListReq {
  userId?: number
  month?: string
  pageNum?: number
  pageSize?: number
}

// 工资详情响应
export interface ISalaryResp {
  id: number
  userId: number
  username: string
  realName: string
  deptName: string
  baseSalary: number
  bonus: number
  deduction: number
  finalSalary: number
  month: string
  createTime: string
}

// 添加工资请求参数
export interface ISalaryReq {
  userId: number
  baseSalary: number
  bonus?: number
  deduction?: number
  month: string
}

// 更新工资请求参数
export interface ISalaryUpdateReq {
  baseSalary?: number
  bonus?: number
  deduction?: number
  month?: string
}
