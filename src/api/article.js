/**
* 文章请求相关
* */
import request from '../utils/request'

/**
 * 获取文章列表
 * */
export const getArticles = params => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/articles',
    // body参数用data设置
    // query参数用params设置
    // headers参数用headers设置
    params: params
  })
}

/**
 * 获取请求频道
 * */
export const getArticleChannels = () => {
  return request({
    methods: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/**
 * 删除文章
 * **/
export const deleteArticle = (articleId) => {
  return request({
    methods: 'DELETE',
    // 接口文档中写的路径参数要在URL中传递
    url: `/mp/v1_0/articles/${articleId}`
  })
}

/**
 * 新建文章
 * **/
export const addArticle = (data, draft = false) => {
  return request({
    methods: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft
    },
    data
  })
}

/**
 * 编辑文章
 * **/
export const updateArticle = (articleId, draft = false, data) => {
  return request({
    methods: 'PUT ',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}

/**
 * 获取指定文章
 * **/
export const getArticle = articleId => {
  return request({
    methods: 'GET ',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
