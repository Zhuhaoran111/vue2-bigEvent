import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
// vuex不做持久化存储，是保存在内存中，所以刷新值会重置，需要存放在浏览器本地的值
export default new Vuex.Store({
  state: {
    token:''  //保存token字符串
  },
  mutations: {
    updateToken(state,val){
      //调用这个方法保存token值
      state.token=val
     

    }
  },
  actions: {
  },
  modules: {
  },
  plugins:
  [createPersistedState()]  //注入持久化存储工具
})
