<template>
  <div class="content">
    <div class="row">
      <div class="col-12">
        <div class="title-header">
          {{ jsonData.descr }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" v-bind:class="{ active: activeView === 'summary' }" @click.prevent="setActive('summary', 'card-view')" href="#">Summary</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" v-bind:class="{ active: activeView === 'legend' }" @click.prevent="setActive('legend', 'legend-view')" href="#">Legend</a>
          </li>
        </ul>
        <transition name="slide" mode="out-in">
          <component v-bind:is="activeComponent"></component>
          <!-- <legend-view></legend-view> -->
        </transition>
        <chart-view></chart-view>
      </div>
      <div class="col-6 component-wrapper">
        <tabular-view></tabular-view>
      </div>
    </div>
  </div>
</template>

<script>
import tabularView from './TabularView'
import chartView from './ChartView'
import cardView from './CardView'
import legendView from './LegendView'
import { mapGetters } from 'vuex'

export default {
  name: 'GTView',
  components: {
    tabularView,
    chartView,
    cardView,
    legendView
  },
  data () {
    return {
      activeView: 'summary',
      activeComponent: 'card-view'
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'jsonData'
    ]
    )
  },
  methods: {
    setActive (view, component) {
      this.activeView = view
      this.activeComponent = component
    }
  }
}
</script>

<style scoped>

.title-header{
  height: 80px;
  white-space: nowrap;
  font-size: 2.8em;
  margin-left: 15px;
  color: #000000;
}

.nav-tabs{
  margin-left: 15px;
}

.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active{
  background-color: #f9f9f9;
  border-bottom: 1px solid #f9f9f9;
}

.component-wrapper{
  overflow: hidden;
}

.slide-leave-active,
.slide-enter-active {
  transition: .5s;
}
.slide-enter {
  transform: translate(-100%, 0);
}
.slide-leave-to {
  transform: translate(100%, 0);
}

</style>
