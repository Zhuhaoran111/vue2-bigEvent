//封装的是具体接口请求方法
//注意：每个方法只负责请求一个url地址
 
//引入自定义的require函数
import require from "@/utils/requaire";

//导出接口方法
export const registerApi=()=>{
    //原地是一个promise对象(内部包含原生ajax请求)
    //return这个Promise对象到逻辑页面，去那边的promise独享提取结果
        return require({
            url:'/api/reg',
            method:'POST',
            data:{
                userame:'huge',
                password:'111111',
                repassword:'111111'
            }
        })
}