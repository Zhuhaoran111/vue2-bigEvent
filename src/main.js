import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入组价库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入去全局的样式
import '@/assets/css/index.less'
//使用组件库
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
