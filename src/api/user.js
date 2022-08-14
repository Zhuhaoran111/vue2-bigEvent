//引入自定义的require函数
import require from "@/utils/requaire";
import store from '@/store'

//这是获取用户资料的接口
export const getUserinfo=()=>{
    return require({
        url:'/my/userinfo',
        //传参够后台：params(查询字符串query),data(请求体body),header(请求头)
        headers:{
            //this.$store.state.token,这里不时组件对象，不能通过this.$store拿到store对象
            //直接用引入的信息
            Authorization:store.state.token
        }
    })
}