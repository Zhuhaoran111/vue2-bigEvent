import axios from 'axios'
import store from '@/store'

//axios.create()创建一个带配置项自定义的axios函数
//require请求的时候，地址BaseUrl+url会请求到后台

const require=axios.create({
        //  //封装基准地址  地址前缀
        baseURL:'http://big-event-vue-api-t.itheima.net'  
})

//定义token请求拦截器
require.interceptors.request.use(function(config){
        //config是配置对象(请求的后台参数都在这个对象上)
        //在请求前会触发一次
        //返回的是axios里面的源码，config配置对象(要请求的后台参数在这个对象上)
        //在发起前，统一携带请求头Authorizaion的tokne值
        //登陆页面和注册页面，vuex里面咩有token,而且登陆接口和注册接口也不需要携带token(其他页面需要)
        //登陆时才有token值
        if(store.state.token){
                //登陆时才会携带token,不登陆则没有
        config.headers.Authorization=store.state.token
        }
       
        return config
},function(error){
        //请求前发起的代码，如果有报错，会直接进入这里
        //会返回一个拒绝的Promise对象
        //类似catch函数的里面的return
        return Promise.reject(error)
})



//导出require函数
export default require