<template>
  <div class="login-container">
    <div class="login-form-wrap">
      <div class="login-head">
        <div class="logo">头条</div>
      </div>
      <el-form class="login-form" ref="login-form" :model="user" :rules="formRules">
        <el-form-item prop="code">
          <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin"
          >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false // 是否同意协议
      },
      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登录的 loading 状态
      formRules: { // 表单验证规则配置
        // 要验证的数据名称：规则列表[]
        mobile: [
          // trigger 用来配置触发校验的时机，有两个选项，change 是当输入的内容发送变化的时候，blur 当失去焦点的时候
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'blur' }
        ],
        agree: [
          {
            // 自定义校验规则：https://element.eleme.cn/#/zh-CN/component/form#zi-ding-yi-xiao-yan-gui-ze
            // 验证通过：callback()
            // 验证失败：callback(new Error('错误消息'))
            // validator 验证函数不是你来调用的，而是当 element 表单触发验证的时候它会自己内部调用
            // 所以你只需要提供校验函数处理逻辑就可以了
            //   通过：callback()
            validator: (rule, value, callback) => {
              if (value) {
                // 验证通过
                callback()
              } else {
                // 验证失败
                callback(new Error('请同意用户协议'))
              }
            },
            // message: '请勾选同意用户协议',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    const that = this
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which
      if (keycode === 13) {
        that.onLogin()// 登录方法名
        return false
      }
    }
  },
  mounted () {},
  methods: {
    onLogin () {
      // 获取表单数据（根据接口要求绑定数据）
      // const user = this.user

      // 表单验证
      // validate 方法是异步的
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }

        // 验证通过，请求登录
        this.login()
      })
    },

    login () {
      // 开启登陆中 loading...
      this.loginLoading = true

      // 对于代码中的请求操作
      // 1、接口请求可能需要重用
      // 2、实际工作中，接口非常容易变动，改起来麻烦
      // 我们建议的做法是把所有的请求都封装成函数然后统一的组织到模块中进行管理
      // 这样做的好处就是：管理维护更方便，也好重用
      login(this.user).then(res => {
        // console.log(res)

        // 登录成功
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭 loading
        this.loginLoading = false

        // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为 JSON 格式字符串进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')

        this.$router.push({
          name: 'home'
        })
      }).catch(err => { // 登录失败
        console.log('登录失败', err)
        this.$message.error('登录失败，手机号或验证码错误')

        // 关闭 loading
        this.loginLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .login-form-wrap {
    min-width: 300px;
    padding: 30px 50px 10px;
    background-color: #fff;
    .login-head {
      display: flex;
      justify-content: center;
      .logo {
        width: 200px;
        height: 57px;
        line-height: 57px;
        font-size: 24px;
        text-align: center;
      }
    }
    .login-form {
      .login-btn {
        width: 100%;
      }
    }
  }
}
</style>
