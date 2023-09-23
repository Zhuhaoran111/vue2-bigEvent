<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!--标题的盒子  -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="form" :model="form" :rules="rulesObj">
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="form.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码哦"
            v-model="form.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            placeholder="请确认密码"
            v-model="form.repassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reg" type="primary" @click="registerFn"
            >注册</el-button
          >
          <el-link type="info" @click="$router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
//技巧：
//前端绑定的数据对象的属性名，可以直接给要调用的功能接口的参数名一致
//好处是：我们可以直接把前端的对象(带着同名的属性和前端的值)发给后台

import { registerApi } from "@/api"; //引入注册的接口
export default {
  data() {
    //注意这里一定要data()函数里面定义箭头函数，箭头函数没有自己this.this指向函数外，才可以使用this.form
    //这里的rule是这个校验规则，value就是填的值
    const samePwd = (rule, vlue, callback) => {
      if (vlue !== this.form.password) {
        //验证失败，则调用回调函数，指定一个error对象
        callback(new Error("两次输入的密码不一致"));
      } else {
        //验证成功，则直接调用callback回调函数即可
        callback();
      }
    };

    return {
      form: {
        username: "", //用户名
        password: "", //密码
        repassword: "", //确认密码
      },
      //表单规则的校验对象
      rulesObj: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: "用户名必须是1-10的大小写字母数字",
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
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            pattern: /^\S{6,15}$/,
            message: "密码必须是6-15的非空字符",
            trigger: "blur",
          },
          //自定义校验规则
          { validator: samePwd, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    //注册点击事件
    registerFn() {
      //js的兜底校验，防止一上来就点击注册按钮
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          //通过校验,拿到绑定的数据和后台数据交互
          //解构赋值。data字段放到res上
          const { data: res } = await registerApi(this.form);
          //注册失败,return 函数就停了，不会向下执行
          if (res.code !== 0) return this.$message.error(res.message);
          //注册成功，提示用户
          this.$message.success(res.message);
          //跳转到登陆页面
          this.$router.push("/login");
        } else {
          return false; //阻止默认行为(表单下面的红色提示会自动出现)
        }
      });
    },
  },
};
</script>

<style scope lang="less">
.reg-container {
  background: url("../../assets/images/夕阳余晖.png") center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 420px;
    height: 335px;
    background-color: #fff;
    position: relative;
    border-radius: 3px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
  }
  .title-box {
    height: 60px;
    background: url("../../assets/images/login_title.png") center no-repeat;
  }

  .btn-reg {
    width: 100%;
  }
}
</style>
