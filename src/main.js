import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

import 'assets/stylus/index.styl'

import VConsole from 'vconsole'
// const vConsole=new VConsole()
// Vue.use(vConsole)

fastclick.attach(document.body) //页面点击 300毫秒延迟

Vue.use(VueLazyload, {
  loading: require('assets/image/lazy-default-qq.png')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
