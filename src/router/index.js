import Vue from 'vue'
import Router from 'vue-router'
import GTView from '@/components/GTView'
// import D3Test from '@/components/D3Test'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/:year',
      name: 'GTView',
      component: GTView
    }
  ]
})
