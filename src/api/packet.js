import { axios } from '@/utils/request'
import api from './index'

// 报文 list
export function GetPacketList(parameter) {
  return axios({
    url: api.PacketList,
    method: 'get',
    params: parameter,
  })
}
