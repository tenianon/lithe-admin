import request from '@/utils/request'

export interface DataTableQuery {
  fullName?: string
  sex: string | null
  phone?: string
  company?: string
}

interface DataTableChildrenRaw {
  parentId?: number
  rowKey?: string
}

export interface DataTable extends DataTableChildrenRaw {
  number: number
  fullName: string
  id: number
  sex: string | null
  age: number | null
  email: string
  phone: string
  address: string
  company: string
  registerDate: string | null
  children: Pick<DataTable, 'number' | 'id' | 'fullName' | 'age' | 'sex' | 'parentId' | 'rowKey'>[]
}

export function getDataTable({ page, pageSize, query }: PaginationRequestBody<DataTableQuery>) {
  return request<PaginationData<DataTable[]>>({
    url: '/dataTable',
    method: 'get',
    params: {
      page,
      pageSize,
      ...query,
    },
  })
}

export function getDataTableById(id: number) {
  return request<DataTable>({
    url: `/dataTable`,
    method: 'get',
    params: {
      id,
    },
  })
}

export function updateDataTable(data: Omit<DataTable, 'number'>) {
  return request({
    url: `/dataTable`,
    method: 'put',
    data,
  })
}

export function deleteDataTable(ids: number | number[]) {
  return request({
    url: `/dataTable`,
    method: 'delete',
    data: {
      ids: Array.isArray(ids) ? ids : [ids],
    },
  })
}

export function createDataTable(data: Omit<DataTable, 'id' | 'parentId' | 'rowKey' | 'number'>) {
  return request({
    url: `/dataTable`,
    method: 'post',
    data,
  })
}

export function deleteDataTableChildren(ids: number | number[]) {
  return request({
    url: `/dataTableChildren`,
    method: 'delete',
    data: {
      ids: Array.isArray(ids) ? ids : [ids],
    },
  })
}
