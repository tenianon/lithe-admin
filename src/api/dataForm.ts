import request from '@/utils/request'

export interface DataForm {
  name: string
  age: number | null
  sex: string
  hobby: Array<string | number>
  phones: Array<{ phone: string }>
  email: string
  dateBirth: number | null
  job: string | null
  address: string
}

export function getRandomDataForm() {
  return request<DataForm>({
    url: '/data/form',
    method: 'get',
  })
}
