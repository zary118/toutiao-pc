<template>
  <el-menu
    class="nav-menu"
    :default-active="$route.path"
    background-color="#002023"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
    :collapse="isCollapse"
  >
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-chat-line-square"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
    <i class="iconfont icon-liwuhuodong"></i>
    <span slot="title">粉丝管理</span>
  </el-menu-item>
    <el-menu-item index="/setting">
    <i class="el-icon-setting"></i>
    <span slot="title">个人设置</span>
  </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'AppAside',
  props: ['is-collapse'],
  components: {
  },
  data () {
    return {
      // isCollapse: false
    }
  },
  computed: {},
  watch: {},
  methods: {
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 10px;
  padding-left: 5px;
}
</style>
