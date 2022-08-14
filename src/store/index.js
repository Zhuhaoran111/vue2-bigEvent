import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserinfo } from '../api/user'  //导入获取信息的接口
Vue.use(Vuex)
// vuex不做持久化存储，是保存在内存中，所以刷新值会重置，需要存放在浏览器本地的值
export default new Vuex.Store({
  state: {
    token:'',  //保存token字符串
    userinfo:{},   //保存用户信息{id,username,nickname  email user_pic}
  },

  getters:{
    // username(state){
    //   return state.userinfo.username
    // } 用下面的简写形式 ,形参一位数省略括号，return语句化，{}和return都可省略
    username:state=> state.userinfo.username,  //用户名
    nickname:state=> state.userinfo.nickname , //用户昵称
    user_pic:state=> state.userinfo.user_pic, //用户头像
    },
 

  mutations: {
      //1.调用这个方法保存token值
    updateToken(state,val){ 
      state.token=val
    },
    //2.调用这个方法保存用户信息，只能在mutations里面赋值
    updateUserinfo(state,info){
      state.userinfo=info
    }
  },



  actions:{
    //这个方法来请求用户的信息,外面直接调用，这里可以直接拿到store
    //这里调用直接用store.commit(mutations里面的方法)
    //在组件那边调用只能用this.$store.(mutations里面的方法)
    //在组件里面调用actions里面的方法用this.$store.dispath(actions里面的方法)
     async getUserinfoActions(store){
       const {data:res}=await getUserinfo()
          store.commit('updateUserinfo',res.data)
     }
  },
  modules: {
  },
  plugins:
  [createPersistedState()]  //注入持久化存储工具
})
