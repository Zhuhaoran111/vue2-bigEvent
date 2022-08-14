//引入自定义的require函数
import require from "@/utils/requaire";
import store from '@/store'

//侧边栏接口
export const getAsideData=()=>{
    return require({
        url:'/my/menus',
        //已经定义了请求拦截器，这里就不用写了
        // headers:{
        //     Authorization:store.state.token
        // }
    })
}