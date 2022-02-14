<template>
  <el-container class="layout-contsiner">
    <el-aside class="aside" width="auto">
      <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i :class="{ 'el-icon-s-fold': isCollapse,'el-icon-s-unfold': !isCollapse }"
             @click="isCollapse = !isCollapse"></i>
          <span>头条后台管理</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" class="avatar" alt="">
            <span class="el-dropdown-link">
            {{ user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          </div>
          <!--          组件默认不识别原生事件的，除非做了处理（.native）-->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  <!--<div class="layout-contsiner">-->
  <!--  <div>顶部导航栏</div>-->
  <!--  <div>侧边导航栏</div>-->
  <!--  <router-view></router-view>-->
  <!--</div>-->
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  props: {},
  components: {
    AppAside
  },
  data () {
    return {
      user: {},
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
    // 注册自定义事件，当这个事件发布后，这个注册函数就会被调用
    globalBus.$on('update-user', (data) => {
      // console.log('update-user', data)
      this.user.name = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确定退出系统?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
      // console.log('onLogout')
      // // 把用户的登录状态清除
      // window.localStorage.removeItem('user')
      // // 跳转到登录页面
      // this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.layout-contsiner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;

  .aside-menu {
    height: 100%;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #CCC;
}

.avatar-wrap {
  display: flex;
  align-items: center;

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.main {
  background: #e9eef3;
}
</style>
