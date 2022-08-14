//引入自定义的require函数
import require from "@/utils/requaire";
import store from '@/store'

//侧边栏接口
export const getAsideData=()=>{
    return require({
        url:'/my/menus',
        headers:{
            Authorization:store.state.token
        }
    })
}