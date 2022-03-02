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

// 获取系统QPS技术信息
export function GetQpsInfo(parameter) {
  return axios({
    url: api.SystemQps,
    method: 'get',
    params: parameter,
  })
}

// 获取系统QPS技术信息
export function GetPacketNumsPerSecond(parameter) {
  return axios({
    url: api.SystemPacketsPerSecond,
    method: 'get',
    params: parameter,
  })
}
