import axios from 'axios'

//axios.create()创建一个带配置项自定义的axios函数
//require请求的时候，地址BaseUrl+url会请求到后台

const require=axios.create({
        //  //封装基准地址  地址前缀
        baseURL:'http://big-event-vue-api-t.itheima.net'  

})
//导出require函数
export default require