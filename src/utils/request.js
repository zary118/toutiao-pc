/**
 * 基于 axios 封装的请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

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

// 导出请求方法
export default request

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//   method: ,
//   url: ''
// })
