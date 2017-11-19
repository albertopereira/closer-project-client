<template>
  <transition name="fadeHeight" mode="out-in">
    <div class="tabular-node" ref="tabular-node">
      <div class="row label-wrapper" @click="toggleChildren">
        <div class="col-4">
          <div>
            <i v-if="nodes" class="fa" v-bind:class="{ 'fa-angle-right': !showC, 'fa-angle-down': showC }" aria-hidden="true"></i>
            {{ label }}
          </div>        </div>
        <div class="col-2">
          {{ growth < 0 ? growth : '+' + growth }}%
        </div>
        <div class="col-2">
            <svg height="40" width="100" class="graph">
              <g class="browser">
                <path class="multiline line" :d="linePath" style="stroke: rgb(31, 119, 180);"></path>
              </g>
            </svg>

        </div>
        <div class="col-2">
          {{ impact }}%
        </div>
        <div class="col-2">
          {{ value }}
        </div>
      </div>
      
        <tabular-node 
            v-if="showChildren"
            v-for="node in nodes" 
            :nodes="node.children" 
            :label="node.key"
            :depth="depth + 1"
            :key="node.id"
            :values="node.values"
            :impact="getImpact(node)"
            :value="getValue(node)"
          >
        </tabular-node>
    </div>
  </transition>
    
</template>

<script>
import * as d3 from 'd3'
import { mapGetters } from 'vuex'
import * as cbspline from 'cardinal-spline-js'

export default {
  name: 'TabularNode',
  props: [ 'nodes', 'label', 'depth', 'values', 'impact', 'value' ],
  data () {
    return {
      showC: false
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'totalValueForYear',
      'allYears',
      'growth',
      'averagePerYear',
      'year'
    ]),
    nodeValues () {
      if (this.values) {
        return this.values.map(el => el.val)
      }
    },
    showChildren () {
      if (this.depth > 0 && !this.showC) {
        return false
      } else {
        return true
      }
    },
    growth () {
      let currentYear = this.values.filter(el => el.year === this.year.toString())
      let previousYear = this.values.filter(el => el.year === (this.year - 1).toString())
      previousYear = previousYear.length ? previousYear : [{ 'val': 0 }]
      return (((currentYear[0].val - previousYear[0].val) * 100) / currentYear[0].val).toFixed(2)
    },
    xscale () {
      return d3.scaleLinear()
        .domain([parseInt(this.allYears[0]), parseInt(this.allYears[this.allYears.length - 1])])
        .range([0, 100])
    },
    yscale () {
      return d3.scaleLinear()
        .domain(
        [0, this.nodeValues.reduce(function (a, b) { return Math.max(a, b) }) * 1.2])
        .range([40, 0])
    },
    linePath () {
      let points = []
      for (let i = 0; i < this.allYears.length; i++) {
        points.push(this.xscale(this.allYears[i]))
        points.push(this.yscale(this.nodeValues[i]))
      }

      points = cbspline.getCurvePoints(points)

      let lineTo = ''

      for (let i = 0; i < points.length; i++) {
        lineTo += points[i] + ', '
      }

      return `
        M
        ${this.xscale(this.allYears[0])}, ${this.yscale(this.nodeValues[0])}
        L
        ${lineTo}
      `
    }
  },
  methods: {
    toggleChildren () {
      this.showC = !this.showC
    },
    getImpact (node) {
      let totalVal = this.values.filter(el => el.year === this.year.toString())
      let nodeVal = node.values.filter(el => el.year === this.year.toString())

      return (nodeVal[0].val * 100 / totalVal[0].val).toFixed(2)
    },
    getValue (node) {
      return this.formatcurrency(node.values.filter(el => el.year === this.year.toString())[0].val)
    },
    formatcurrency (value) {
      value = value * 1000
      if (value === undefined) {
        return 'N/A'
      } else if (value >= 1000000) {
        return '€' + Math.round(value / 1000000).toString() + ' M'
      } else if (value < 1000000 && value >= 1000) {
        return '€' + Math.round(value / 1000).toString() + '.000'
      } else if (value < 1 && value !== 0) {
        return 'c' + Math.round(value * 100).toString()
      } else {
        return '€ ' + value.toString()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabular-node{
  padding:0px 15px;
}

.line {
    fill: none;
    stroke-width: 1;
    stroke-linejoin: round;
    stroke-linecap: round;
    opacity: 0.6;
}

.graph{
  margin-top: -10px;
}

.label-wrapper{
  border-bottom: 1px solid #dddddd;
  height: 50px;
  padding-top: 15px;
}

.label-wrapper:hover{
  background-color:#dddddd;
  cursor: pointer;
}

.fa{
  margin-right: 7px;
}

.fadeHeight-enter-active,
.fadeHeight-leave-active {
  transition: all 0.2s;
  height: 230px;
}
.fadeHeight-enter,
.fadeHeight-leave-to
{
  opacity: 0;
  height: 0px;
}
</style>
