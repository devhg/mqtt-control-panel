import { axios } from '@/utils/request'
import api from './index'

export function getClusterInfo(parameter) {
  return axios({
    url: api.ClusterInfo,
    method: 'get',
    params: parameter
  })
}

export function getTopicList(parameter) {
  return axios({
    url: api.TopicList,
    method: 'get',
    params: parameter
  })
}
export function getClusterMetrics(parameter) {
  return axios({
    url: api.ClusterMetrics,
    method: 'get',
    params: parameter
  })
}
