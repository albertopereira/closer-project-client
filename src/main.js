import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store/store'

// Remove annoying tip "You are running Vue in development mode..."
Vue.config.productionTip = false

// Allow access to router in the store
sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
