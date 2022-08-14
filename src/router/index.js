import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  //默认打开显示登陆页面
  {
    path:'/',
    component:()=>import('@/views/layout')
  },
    {
      path:'/reg',
      component:()=>import('@/views/register')
      //webpack函数提供impor函数来路由懒加载导入组件
      //路由懒加载，就是页面路由路径切换到/reg,才去加载对应组件代码
      //好处：让首页加载文件体积更小，打开更快
    },
    {
      path:'/login',
      component:()=>import('@/views/login')
    }
]

const router = new VueRouter({
  routes
})
//全局前置路由守卫,路由跳转时就获取用户的信息
router.beforeEach((to,from,next)=>{
  const token=store.state.token
  //本地有token值就发起请求用户的信息
  //token存在，username不存在才会去执行这个获取用户信息
  //token不存在不请求用户信息，
  //token存在，但是用户名也存在，就没必要请求用户信息了,当你收订跳转其它页面，用户信息还是存在的，就不要请求了
  if(token && !store.state.userinfo.username){
    store.dispatch('getUserinfoActions')
  }
   
    next()
})

export default router

//注意：退出登录，重新登录，只走相关的组件代码(异步dom切换，不会导致所有代码重新执行,App.vue不会走)
//目的：换个账号啊得重新请求用户的数据

//解决：
//1.可以在登录页main，登录成功过后，在发起请求拿到用户的信息
//2.可以在全局前置路由守卫中，写(路由跳转的时候,判断+获取)
