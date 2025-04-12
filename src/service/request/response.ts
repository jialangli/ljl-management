export default interface NetResponse<T = null> {
  code: number
  message: string
  data: T
}

// 分页响应
// export interface IPageResult<T> {
//   records: T[]
//    total: number
//    pages: number
// }
