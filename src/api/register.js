import api from './index'
import {
    axios
} from '@/utils/request'

export function register(parameter) {
    return axios({
        url: api.Register,
        method: 'post',
        data: parameter
    })
}