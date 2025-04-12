import { authPath } from '@/service/config/types'
import createSvcRequest from '@/service/request'
import type NetResponse from '@/service/request/response'
import type { ILoginByPwdRequest, ILoginResponse } from './types'

// 创建 auth 实例
const authSvc = createSvcRequest(authPath)

export function LoginByPwdSvc(account: ILoginByPwdRequest) {
  return authSvc.POST<NetResponse<ILoginResponse>>({
    url: '/login',
    data: account,
  })
}
