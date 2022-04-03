import { axios } from '@/utils/request'
import api from './index'

// 客户端 list
export function GetClientList(parameter) {
  return axios({
    url: api.ClientList,
    method: 'get',
    params: parameter
  })
}

// 客户端 添加
export function AddClient(data) {
  return axios({
    url: api.ClientCreate,
    method: 'post',
    data: data
  })
}

// 客户端 删除
export function DeleteClient(parameter) {
  return axios({
    url: api.ClientDelete,
    method: 'delete',
    params: parameter
  })
}
