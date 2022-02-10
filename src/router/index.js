import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Image from '@/views/image'
import Fans from '@/views/fans'
import Comment from '@/views/comment'
import Publish from '@/views/publish'
import Setting from '@/views/setting'
Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫， 所有页面导航都要经过这里
// next放行方法
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))

  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
