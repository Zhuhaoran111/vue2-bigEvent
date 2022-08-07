//封装的是具体接口请求方法
//注意：每个方法只负责请求一个url地址
 
//引入自定义的require函数
import require from "@/utils/requaire";
//导出接口方法
export const registerApi=({username,password,repassword})=>{
    //原地是一个promise对象(内部包含原生ajax请求)
    //return这个Promise对象到逻辑页面，去那边的promise独享提取结果
       
        return require({
            url:'/api/reg',
            method:'POST',
            data:{
                username,
                password,
                repassword,
            }
              //axios传参params和data
            //params的对象参数名和值会出现在url,axios源码hi把参数和中，拼接在url?后面给后台(query查询字符串)
            //data的对象参数名和值，axios源码会把参数和值拼接在请求体(body参数)     
        })
}

//登录的api接口
export const loginApi=({username,password})=>{
    return require({
        url:'/api/login',
        method:'POST',
        data:{
            username,
            password,
        }
    })
}