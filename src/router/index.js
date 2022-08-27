import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  //默认打开显示登陆页面
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由,重定向
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar.vue')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd.vue')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    //webpack函数提供impor函数来路由懒加载导入组件
    //路由懒加载，就是页面路由路径切换到/reg,才去加载对应组件代码
    //好处：让首页加载文件体积更小，打开更快
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})
let whiteList = ['/login', '/reg']
//白名单，无需登陆就可以访问的路由地址


//全局前置路由守卫,路由跳转时就获取用户的信息
//知识点1：浏览器第一次打开项目页面，会触发一次其那只路由守卫函数
//知识点2：有token就登陆了，没有token则没有登陆
//知识点3：next()如果强制切换路由地址，会再次走路由守卫再次去匹配路由表，进入死循环
router.beforeEach((to, from, next) => {
  const token = store.state.token
  //本地有token值就发起请求用户的信息
  //token存在，username不存在才会去执行这个获取用户信息
  //token不存在不请求用户信息，
  //token存在，但是用户名也存在，就没必要请求用户信息了,当你收订跳转其它页面，用户信息还是存在的，就不要请求了
  if (token) {
    if (!store.state.userinfo.username) {
      store.dispatch('getUserinfoActions')
    }
    //登陆了正常放行
    next()
  } else {
    //未登录
    //includes(值)  作用：判断值是否在数组里面的出现过，出现过原地返回true
    //
    if (whiteList.includes(to.path)) {
      //未登录，可以访问的路由地址，则放行(全局前置路由守卫不会在触发了，而是匹配路由表，让组件挂在)
      next()  //正常放行,
    } else {
      //next()强制跳转到登陆页
      next('/login')
    }

  }


})

export default router

//注意：退出登录，重新登录，只走相关的组件代码(异步dom切换，不会导致所有代码重新执行,App.vue不会走)
//目的：换个账号啊得重新请求用户的数据

//解决：
//1.可以在登录页main，登录成功过后，在发起请求拿到用户的信息
//2.可以在全局前置路由守卫中，写(路由跳转的时候,判断+获取)
