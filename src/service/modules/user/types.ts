// 用户列表请求参数
export interface IUserListReq {
  username?: string
  realName?: string
  deptId?: number
  pageNum?: number
  pageSize?: number
}

// 用户列表响应项
export interface IUserListResp {
  id: number
  username: string
  realName: string
  deptId: number
  deptName: string
  role: number
  phone: string
  email: string
  avatar: string
  createTime: string
}

// 添加用户请求参数
export interface IAddUserReq {
  username: string
  password: string
  realName?: string
  deptId?: number
  role: number
  phone?: string
  avatar?: string
  email?: string
}

// 更新用户请求参数
export interface IUpdateUserReq {
  username?: string
  password?: string
  realName?: string
  deptId?: number
  role?: number
  phone?: string
  avatar?: string
  email?: string
}
