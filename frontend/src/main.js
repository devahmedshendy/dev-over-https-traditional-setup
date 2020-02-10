import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import * as plugins from './plugins'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  ...plugins,
  render: (h) => h(App)
}).$mount('#app')
