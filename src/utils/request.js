/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '../router'
import { Message } from 'element-ui'

// JSONbig.parse()
// JSONbig.stringify()

// axios()
// axios.get()
// axios.post()

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 最新接口地址
  // 定义后端返回的原始数据处理
  // data就是后端返回的原始数据
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
// config是当前请求相关的配置信息对象
request.interceptors.request.use(function (config) {
  // 所有请求会经过这里
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果有登陆信息，则统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 请求失败会经过这里
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function (response) {
  // 任何2xx范围内的状态代码都会触发此函数
  return response
}, function (error) {
  // 任何超出2xx范围的状态码都会触发此函数
  if (error.response && error.response.status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (error.response.status === 403) {
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (error.response.status === 400) {
    Message('参数错误,请检查请求参数')
  } else if (error.response.status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error)
})
// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
