<template>
<div class="image-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>素材管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="action-head">
      <el-radio-group v-model="collect" size="mini" @change=" loadImages(1)">
        <el-radio-button
          :label="false"
        >
          全部
        </el-radio-button>
        <el-radio-button
          :label="true"
        >
          收藏
        </el-radio-button>
      </el-radio-group>
      <el-button
        size="mini"
        type="success"
        @click="dialogUploadVisible=true"
      >上传素材</el-button>
    </div>
    <el-row :gutter="10">
      <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(img, index) in images" :key="index" class="image-item">
        <el-image
        style="height: 100px;width: 100%"
        :src="img.url"
        fit="cover">
        </el-image>
        <!--
        class样式绑定
        {
          class类名：布尔值
        }
         true：作用类名
         false：不作用类名
        -->
        <div class="iamge-action">
          <el-button
            type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="onCollect(img)"
            :loading="img.loading"
            size="small"
            circle
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete-solid"
            @click="onDelete(img)"
            :loading="img.loading"
            circle
            size="small"
          ></el-button>
<!--          <i :class="{-->
<!--            'el-icon-star-on': img.is_collected,-->
<!--            'el-icon-star-off': !img.is_collected-->
<!--          }"-->
<!--             @click="onCollect(img)"-->
<!--          ></i>-->
<!--          <i class="el-icon-delete-solid"></i>-->
        </div>
      </el-col>
    </el-row>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
    >
    </el-pagination>
  </el-card>
  <el-dialog
    title="上传素材"
    :visible.sync="dialogUploadVisible"
    :append-to-body="true"
  >
    <!-- upload组件本身就支持请求提交上传的操作
      请求方法：默认就是POST
      请求路径：action（必须写完整路径）
      请求头：headers
    -->
    <el-upload
      class="upload-demo"
      drag
      action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
      :headers="uploadHeaders"
      name="image"
      multiple
      :show-file-list="false"
      :on-success="onUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-dialog>
</div>
</template>

<script>
import { getImages, collectImages, deleteImages } from '../../api/image'

export default {
  name: 'ImageIndex',
  props: {},
  components: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [], // 图片素材
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      pageSize: 20,
      page: 1
    }
  },
  created () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  computed: {},
  watch: {},
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有 loading 数据
          // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // onCollectChange () {
    //   this.loadImages(1)
    // },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    },
    onPageChange (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImages(img.id, !img.is_collected).then(res => {
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImages(img.id, false)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImages(img.id, true)
      // }
    },
    onDelete (img) {
      img.loading = true
      deleteImages(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        img.loading = true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.action-head {
  width: 100%;
  padding-bottom: 28px;
  display: flex;
  justify-content: space-between;
}

.image-item {
  position: relative;
}

.iamge-action {
  height: 40px;
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 4px;
  background: rgba(204, 204, 204, .5);
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: #ffffff;
}
</style>
