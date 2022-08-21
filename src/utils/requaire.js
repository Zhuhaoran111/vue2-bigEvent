import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

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
//定义相应拦截器，后台返回来的相应作出统一哦处理判断
require.interceptors.response.use(function(response){
        //相应的http状态码为2xx,3xx时触发成功的回调，形参中的response是成功的结果
        //return到axios原地Promise对象，作为成功的结果
        return response
},function(error){
        console.dir(error)
        //相应状态码4xx,5xx时触发失败的回调，形参中的error是失败的结果
        //return到axios原地的Promsie对象位置，作为失败拒绝的状态（如果那边用try+catch或者用catch函数捕获
        //可以捕获到我们传递过去的这个error变量的值
        if(error.response.status===401){
                
                //本次响应token过期了
                //清除vuex和切换到登陆页面
                //利用store.commit调用vuex里面的mutations方法，然后置空
                store.commit('updateToken','')
                store.commit('updateUserinfo',{})
                
                router.push('/login')
                Message.error('用户身份已过期')  
        }


        return Promise.reject(error)
})



//导出require函数
export default require