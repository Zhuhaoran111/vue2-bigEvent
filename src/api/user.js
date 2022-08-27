//引入自定义的require函数
import require from "@/utils/requaire";
// import store from '@/store'

//这是获取用户资料的接口
export const getUserinfo = () => {
    return require({
        url: '/my/userinfo',
        //传参够后台：params(查询字符串query),data(请求体body),header(请求头)
        //已经定义了请求拦截器，就不需要写了
        // headers:{
        //     //this.$store.state.token,这里不时组件对象，不能通过this.$store拿到store对象
        //     //直接用引入的信息
        //     Authorization:store.state.token
        // }
    })
}

//这是更新用户的api
export const updateUserinfo = ({ id, username, nickname, email, user_pic }) => {
    return require({
        url: '/my/userinfo',
        method: 'PUT',
        data: {
            id,
            username,
            nickname,
            email,
            user_pic
        }
    })
}
/**
 * 更新-用户头像
 * @param {*} avatar 头像的base64字符串
 * @returns Promise对象
 */
export const updateAvatarAPI = (avatar) => {
    return require({
        url: '/my/update/avatar',
        method: 'PATCH',
        data: {
            avatar   //头像base64字符串
        }
    })
}


//更新用户密码的api
//{ old_pwd, new_pwd, re_pwd }=this.pwdForm 进行结构赋值
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
    return require({
        url: '/my/updatePwd',
        method: 'PATCH',
        data: {
            old_pwd,
            new_pwd,
            re_pwd
        }


    })
}