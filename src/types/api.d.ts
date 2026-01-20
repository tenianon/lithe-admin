declare interface ResponseBody<T = any> {
  code: number
  message: string
  data: T
}

declare interface PaginationData<T = any> {
  list: T
  total: number
}

declare type PaginationRequestBody<T = any> = {
  page: number
  pageSize: number
  query: T & Record<string, any>
}
