<template>
  <div id="main">
    <heatmap-view v-if="currentView === 'm'"></heatmap-view>
    <gt-view v-if="currentView === 'gt'"></gt-view>
    <bubble-view v-if="currentView === 'b'"></bubble-view>
    <tabular-view v-if="currentView === 't'"></tabular-view>
  </div>
</template>

<script>
import gtView from './gtView'
import tabularView from './TabularView'
import heatmapView from './HeatmapView'
import bubbleView from './BubbleView'
import { mapGetters } from 'vuex'

export default {
  name: 'Main',
  components: {
    gtView,
    tabularView,
    bubbleView,
    heatmapView
  },
  data () {
    return {
      view: 'gt'
    }
  },
  computed: {
    ...mapGetters([
      'jsonData'
    ]),
    currentView () {
      if (this.$route.params.view === undefined) {
        if (this.jsonData.view.indexOf('gt') > -1) {
          return 'gt'
        } else if (this.jsonData.view.indexOf('t') > -1) {
          return 't'
        } else if (this.jsonData.view.indexOf('b') > -1) {
          return 'b'
        } else if (this.jsonData.view.indexOf('h') > -1) {
          return 'm'
        }
      } else {
        return this.$route.params.view
      }
    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
