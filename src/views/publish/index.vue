<template>
<div class="publish-container">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="article"
      :rules="formRules"
      label-width="60px"
        ref="publish-form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="article.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
<!--         <el-input type="textarea" v-model="article.content"></el-input>-->
        <el-tiptap v-model="article.content" lang="zh" height="400" :extensions="extensions" palceholder="请输入文章内容"></el-tiptap>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="article.cover.type">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道" prop="channel">
        <el-select v-model="article.channel_id" placeholder="请选择频道">
          <el-option
            :label="channel.name"
            :value="channel.id"
            v-for="(channel,index) in channels"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onPublish(false)">发表</el-button>
        <el-button @click="onPublish(true)">存入草稿</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
import { getArticleChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import 'element-tiptap/lib/index.css'
import {
  ElementTiptap,
  // 需要的 extensions(扩展功能)
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  Fullscreen,
  TextColor
} from 'element-tiptap'
import { uploadImage } from '@/api/image'
export default {
  name: 'PublishIndex',
  props: {},
  components: {
    'el-tiptap': ElementTiptap
  },
  data () {
    return {
      channels: [], // 文章频道列表
      article: {
        titile: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'change' }
          {
            validator (rule, value, callback) {
              console.log('content validator')
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(), // 斜体
        new Strike(), // 删除线
        new ListItem(),
        new BulletList(), // 无序
        new OrderedList(), // 有序
        new Image(
          {
            // 默认会把图片生成base64
            // 如果自定义图片上传-----uploadRequest是图片的上传方法，返回一个 Promise<url>
            uploadRequest (file) {
              const fd = new FormData()
              fd.append('image', file)
              // 第一个return是返回promise对象（axios本身就是返回promise对象）
              return uploadImage(fd).then(res => {
                // 第二个return是返回最后的结果
                return res.data.data.url
              })
            }
          }
        ),
        new Fullscreen(),
        new TextColor()
      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 发布和修改使用的是同一个组件
    // 进行判断，如果路由路径参数有 id ，则请求展示文章的内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },

    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败，停止提交表单
        if (!valid) {
          return
        }
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 判断如果是修改文章，则执行修改操作；否则执行添加操作
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        } else {
          // 执行添加操作
          addArticle(this.article, draft).then(res => {
            // 处理响应结果
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
        // 验证通过，提交表单
      })
    },

    // 修改文章： 加载文章内容
    loadArticle () {
      // console.log('loadArticle')
      // 找到数据接口
      // 封装请求接口
      // 请求获取数据
      getArticle(this.$route.query.id).then(res => {
        // 模板绑定展示
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
