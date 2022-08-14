<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="" />
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-top"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-submenu index="1">
          <template slot="title">
            <!-- 头像 -->
            <img src="../../assets/images/logo.png" alt="" class="avatar" />
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1"
            ><i class="el-icon-s-operation"></i>基本资料</el-menu-item
          >
          <el-menu-item index="1-2"
            ><i class="el-icon-camera"></i>更换头像</el-menu-item
          >
          <el-menu-item index="1-3"
            ><i class="el-icon-key"></i>重置密码</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"
          ><i class="el-icon-switch-button"></i>退出</el-menu-item
        >
      </el-menu>
    </el-header>

    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <!-- 1、这是侧边栏用户信息区域 -->
        <div class="user-box">
          <!-- 有照片则用后端的照片，没有则用自己的照片 -->
          <img :src="user_pic" alt="" v-if="user_pic" />
          <img src="../../assets/images/sample.jpg" alt="" v-else />
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 2.这是侧边导航栏 -->
        <el-menu
          default-active="/home"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <!-- 
           unique-opened:默认只能打开一个菜单
           router,点击某行菜单，index作为路由值切换
         -->
          <!-- 有子的 el-submenu形式，没有子的el-menu-item
          (里面嵌套的template #title的当前展示内容，子用el-menu-item显示
          如果里面还有嵌套则用el-menu-item-group包裹，里面嵌套的template的当前展示内容，后面就是子
          )
          -->
          <template v-for="item in menus">
            <!-- 你没有孩子首页就用这个 ,这里index前面不加：就是字符串item.indexPath，加了：就是变量就是indexPath的值-->
            <el-menu-item
              v-if="!item.children"
              :index="item.indexPath"
              :key="item.indexPath"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>

            <el-submenu v-else :index="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                v-for="item1 in item.children"
                :index="item1.indexPath"
              >
                <i :class="item1.icon"></i>
                <span>{{ item1.title }}</span>
              </el-menu-item>
            </el-submenu>
            
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <el-main> Main.vue后台主页 </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
//知识点：在组件标签上绑定的所有事件(包括原生的事件的名字click，input等等)
//都是自定义事件，都需要组件内$emit来触发才行
//万一组件内不支持这个原生事件的名字，解决：@事件名.native="methods里面的方法名"
//.native给组件内根标签，绑定这个原生的事件
import { mapGetters } from "vuex";
import { getAsideData } from "@/api/aside.js";
export default {
  name: "my-layout",
  data() {
    return {
      menus: [],
    };
  },
  created() {
    //一上来获取这个侧边栏的数据
    this.getAsideDataFn();
  },
  //映射vuex里面的数据
  computed: {
    ...mapGetters(["username", "nickname", "user_pic"]),
  },
  methods: {
    //这里是获取侧边栏数据的接口调用
    async getAsideDataFn() {
      const { data: res } = await getAsideData();
      this.menus = res.data;
      console.log(this.menus)
    },

    //退出登录点击事件
    quitFn() {
      this.$confirm("这就走了吗?, 不爱我了吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //选择确定
          //直接调用mutations里面的方法
          //  this.$store.commit("updateToken", ""); //前面触发的是哪个方法，后面是要传的值
          //清除vuex，跳转到登陆页面
          this.$store.commit("updateToken", ""); //退出登录，清除token值
          this.$store.commit("updateUserinfo", {}); //退出登录清除用户信息
          this.$router.push("/login"); //退出登录

          this.$message.success("退出成功");
        })
        .catch(() => {
          //选择取消
        });
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  height: 100%;
  .el-header,
  .el-aside {
    background: url("../../assets/images/夕阳余晖.png");
  }
  .el-header {
    padding: 0;
    display: flex;
    justify-content: space-between;
  }
  .el-main {
    overflow-y: scroll;
    height: 0;
    background-color: #f2f2f2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.avatar {
  border-radius: 50%;
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  object-fit: cover;
}

// 左侧边栏用户信息区域
.user-box {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  user-select: none;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fff;
    margin-right: 15px;
    object-fit: cover;
  }
  span {
    color: white;
    font-size: 16px;
  }
}

::v-deep .el-submenu__title,
.el-menu-item {
  font-size: 16px;
}
.el-aside {
  width: 16% !important;
}
</style>
