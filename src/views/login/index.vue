<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 登录的表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginRef">
        <!-- 用户名 1 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
          <!-- @click="$router.push('/reg')" 跳转到注册页面 -->
          <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from "@/api"; //引入注册的接口
import { mapMutations } from "vuex";
export default {
  name: "my-login",
  data() {
    return {
      // 登录表单的数据对象
      loginForm: {
        username: "",
        password: "",
      },
      // 登录表单的验证规则对象
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的字母数字",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["updateToken"]), //映射到当前的方法里面

    //登录点击事件
    loginFn() {
      console.log("111");
      this.$refs.loginRef.validate(async (valid) => {
        if (valid) {
          //发起登录登录接口
          //解构赋值就是为了把后台真正的书籍赋值给了res
          const { data: res } = await loginApi(this.loginForm);
          console.log(res)
          //根据后台返回的登陆信息做提示，
          if (res.code !== 0) return this.$message.error(res.message);
          //登陆成功提示
          this.$message.success(res.message);
          //登陆成功把token值传到vuex中
          this.updateToken(res.token);
          //登陆成功跳转到布局页
          this.$router.push("/");
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  background: url("../../assets/images/夕阳余晖.png") center;
  background-size: cover;
  height: 100%;

  .login-box {
    width: 420px;
    height: 270px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url("../../assets/images/login_title.png") center no-repeat;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
