// 登录
export interface ILoginByPwdRequest {
  username: string
  password: string
}

export interface ILoginResponse {
  token: string
}
