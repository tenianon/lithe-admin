declare interface ResponseBody<T = unknown> {
  code: number
  message: string
  data: T
}

declare interface PaginationData<T = unknown> {
  list: T
  total: number
}

declare type PaginationRequestBody<T = unknown> = {
  page: number
  pageSize: number
  query: T & Record<string, unknown>
}
