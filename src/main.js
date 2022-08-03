import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入去全局的样式
import '@/assets/css/index.less'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
