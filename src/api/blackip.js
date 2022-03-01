import { axios } from '@/utils/request'
import api from './index'

// IP黑名单 list
export function GetBlackIPList(parameter) {
  return axios({
    url: api.BlackIPList,
    method: 'get',
    params: parameter,
  })
}

// IP黑名单 添加
export function AddBlackIP(data) {
  return axios({
    url: api.BlackIPCreate,
    method: 'post',
    data: data,
  })
}

// IP黑名单 删除
export function DeleteBlackIP(data) {
  return axios({
    url: api.BlackIPDelete,
    method: 'delete',
    data: data,
  })
}

// IP黑名单 更新
export function UpdateBlackIP(data) {
  return axios({
    url: api.BlackIPUpdate,
    method: 'post',
    data: data,
  })
}
