import axios from 'axios'
import qs from 'qs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserInfoStore } from '@/stores/store'
import config from '../config'
import router from '../router'

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
  if (response && response.status === 200) {
    // 如果不需要除了data之外的数据，可以直接 return response.data
    return response
  }
  //在main.js中配置了全局错误拦截器，所以这里不用处理错误了
  return Promise.reject({ msg: '网络异常' })
}

function checkCode(res) {
  if (res.data && res.data.err > 0) {
    if ([900, 901, 902, 401].includes(res.data.err)) {
      useUserInfoStore().removeUserInfo()
      //目的是先抛异常，然后跳转登录页
      setTimeout(() => {
        return router.push({ name: 'login' })
      }, 0)
    }
    //在main.js中配置了全局错误拦截器，所以这里不用处理错误了
    return Promise.reject(res.data)
  }
  return res.data.data
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
