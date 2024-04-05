import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/stores/store'
import config from '../config'

axios.defaults.timeout = 5000
axios.defaults.baseURL = config.baseURL + '/v1'
axios.interceptors.request.use(
  (config) => {
    const { userInfo: user } = useUserInfoStore()
    if (user.token) {
      // config.headers.common['Token'] = user.token
      config.headers['Token'] = user.token
      // console.log(config.headers)
    }
    NProgress.start()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.resolve(error.response)
  }
)
function checkStatus(response) {
  NProgress.done()
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    alert(res.msg)
  } else if (res.data && res.data.err > 0) {
    return { err: res.data.err, msg: res.data.msg }
  }
  return res
}

export default {
  get(url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      headers: {}
    })
      .then(checkStatus)
      .then(checkCode)
  },
  post(url, params) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(checkStatus)
      .then(checkCode)
  },
  put(url, params) {
    return axios({
      method: 'put',
      url,
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(checkStatus)
      .then(checkCode)
  },
  delete(url, params) {
    return axios({
      method: 'delete',
      url,
      data: qs.stringify(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    })
      .then(checkStatus)
      .then(checkCode)
  }
}
