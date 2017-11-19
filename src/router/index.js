import Vue from 'vue'
import Router from 'vue-router'
// import GTView from '@/components/GTView'
// import TabularView from '@/components/TabularView'
// import HeatmapView from '@/components/HeatmapView'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/:budget_id/:view_id/:view?/:year?',
      name: 'Main',
      component: Main
    }
  ]
})
