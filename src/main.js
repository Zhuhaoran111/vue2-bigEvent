import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入组价库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入去全局的样式
import '@/assets/css/index.less';
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
//使用组件库
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
