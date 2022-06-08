import api from './index'
import { axios } from '@/utils/request'

export function register(parameter) {
  return axios({
    url: '/auth/register',
    method: 'post',
    data: parameter
  })
}
