export interface IUser {
  id: number
  name: string
  SkuId: string
  mallname: string
  enable: number
  price: number
  roleId: number
  BuyAt:string
  receiveman: string
  createAt: string
  updateAt: string
}

export interface ISystemState {
  usersList: IUser[]
  usersTotalCount: number

  pageList: any[]
  pageTotalCount: number
}
