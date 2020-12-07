import {
  axios
} from '@/utils/request'
import api from './index'

export function getStudentList(parameter) {
  return axios({
    url: api.StudentList,
    method: 'get',
    params: parameter
  })
}

export function StudentUpdate(parameter) {
  return axios({
    url: api.StudentUpdate,
    method: 'post',
    data: parameter
  })
}

export function StudentDelete(parameter) {
  return axios({
    url: api.StudentDelete,
    method: 'post',
    data: parameter
  })
}

export function StudentUpload(parameter) {
  return axios({
    url: api.StudentUpload,
    method: 'post',
    data: parameter
  })
}


export function StudentAnalysis(parameter) {
  return axios({
    url: api.StudentAnalysis,
    method: 'get',
    params: parameter
  })
}

export function StudentAnalysisCourse(parameter) {
  return axios({
    url: api.StudentAnalysisCourse,
    method: 'get',
    params: parameter
  })
}