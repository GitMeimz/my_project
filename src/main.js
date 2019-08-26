import Vue from 'vue'
import App from './App.vue'

// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式
import '@/style/index.less'
import router from '@/router/router.js'
// 添加导航守卫
router.beforeEach((to, from, next) => {
        var toke = localStorage.getItem('itcast')
        if(toke || to.path === '/login'){
          next()
        }else{
          next({name:'login'})
        }     
})
// 让Vue使用element-ui
Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
