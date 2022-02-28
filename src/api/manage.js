import { axios } from '@/utils/request'
import api from './index'

// IP黑名单 list
export function getBlackIPList(parameter) {
  return axios({
    url: api.BlackIPList,
    method: 'get',
    params: parameter,
  })
}

// IP黑名单 添加
export function addBlackIP(data) {
  return axios({
    url: api.BlackIPCreate,
    method: 'post',
    data: data,
  })
}

////////////////////////

export function StudentUpdate(parameter) {
  return axios({
    url: api.StudentUpdate,
    method: 'post',
    data: parameter,
  })
}

export function StudentDelete(parameter) {
  return axios({
    url: api.StudentDelete,
    method: 'post',
    data: parameter,
  })
}

export function StudentUpload(parameter) {
  return axios({
    url: api.StudentUpload,
    method: 'post',
    data: parameter,
  })
}

export function StudentAnalysis(parameter) {
  return axios({
    url: api.StudentAnalysis,
    method: 'get',
    params: parameter,
  })
}

export function StudentAnalysisCourse(parameter) {
  return axios({
    url: api.StudentAnalysisCourse,
    method: 'get',
    params: parameter,
  })
}

export function getUser(parameter) {
  return axios({
    url: api.StudentAnalysisCourse,
    method: 'get',
    params: parameter,
  })
}
