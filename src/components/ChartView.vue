<template>
    <div class="chart" ref="chart">
      <svg :height="height" :width="width + 20" v-if="selectedNode">
        <g>
          <g class="multigrid" transform="translate(0,230)">
            <g class="tick major" style="opacity: 1;" v-for="tick in xTicks" :transform="xTicksTransform(tick)">
              <line x2="0" :y2="height * -1"></line>
              <text dy=".71em" style="text-anchor: middle;" x="0" y="3"></text>
            </g>
            <path class="domain" d="M50,0V0H809V0"></path>
          </g>
          <g class="multigrid" transform="translate(50,0)">
            <g class="tick major" style="opacity: 1;" v-for="tick in yTicks" :transform="yTicksTransform(tick)">
              <line :x2="width - 50" y2="0"></line>
              <text dy=".32em" style="text-anchor: end;" x="-3" y="0"></text>
            </g>
          </g>
        </g>

        <g class="layers">
          <svg>
            <g class="browser">
              <path class="multiarea" :d="multiareaPath" style="fill: rgb(31, 119, 180);"></path>
              <path class="multiline" :d="linePath" style="stroke: rgb(31, 119, 180);"></path>
            </g>
          </svg>
        </g>
        
        <g class="axis xAxis" transform="translate(0,230)">
          <g class="tick major thisYear" style="opacity: 1;" v-for="year in allYears" :transform="xAxisTransform(year)">
            <line x2="0" y2="0"></line>
            <text dy=".71em" style="text-anchor: middle;" x="0" y="10">
              {{ year }}
            </text>
          </g>
        </g>

        <g class="axis" transform="translate( 50,0)">
          <g class="tick major" style="opacity: 1;" v-for="value in selectedNodeValues" :transform="yAxisTransform(value)">
            <line x2="0" y2="0"></line>
            <text dy=".32em" style="text-anchor: end;" x="-5" y="0">
              {{ formatCurrency(value) }}
            </text>
          </g>
        </g>
      </svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import { mapGetters } from 'vuex'

export default {
  name: 'ChartView',
  data () {
    return {
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 700,
      height: 260,
      formatNumber: d3.format(',d'),
      selected: null,
      color: {},
      xmargin: 50,
      ymargin: 30,
      xTicks: 6,
      yTicks: 4
    }
  },
  watch: {
    year () {

    }
  },
  mounted () {
    var that = this
    that.color = d3.scaleOrdinal(d3.schemeCategory20)

    this.$nextTick(() => {

    })
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'year',
      'allYears',
      'selectedNode'
    ]
    ),
    selectedNodeValues () {
      if (this.selectedNode.values) {
        return this.selectedNode.values.map(el => el.val)
      }
    },
    xscale () {
      return d3.scaleLinear()
        .domain([parseInt(this.allYears[0]), parseInt(this.allYears[this.allYears.length - 1])])
        .range([this.xmargin, this.width])
    },
    yscale () {
      if (this.selectedNodeValues) {
        return d3.scaleLinear()
          .domain(
          [0, this.selectedNodeValues.reduce(function (a, b) { return Math.max(a, b) }) * 1.2])
          .range([this.height - this.ymargin, 10])
      }
    },
    xTickSize () {
      return ((this.xscale.range()[1] - 1) / this.xTicks)
    },
    yTickSize () {
      if (this.yscale) {
        return ((this.yscale.range()[0] + 25 + this.xmargin) / this.yTicks)
      }
    },
    indexOfYear () {
      return this.jsonData.values.map(function (el) { return el.year }).indexOf(this.year)
    },
    linePath () {
      if (this.allYears && this.selectedNodeValues) {
        return `
          M 
          ${this.xscale(this.allYears[0])}, ${this.yscale(this.selectedNodeValues[0])} 
          C 
          ${this.xscale(this.allYears[0])}, ${this.yscale(this.selectedNodeValues[0])},
          ${this.xscale(this.allYears[1]) - 100}, ${this.yscale(this.selectedNodeValues[1]) - 10},
          ${this.xscale(this.allYears[1])}, ${this.yscale(this.selectedNodeValues[1])}
          S
          ${this.xscale(this.allYears[2])}, ${this.yscale(this.selectedNodeValues[2]) - 10},
          ${this.xscale(this.allYears[2])}, ${this.yscale(this.selectedNodeValues[2])}
        `
      }
    },
    multiareaPath () {
      if (this.allYears && this.selectedNodeValues) {
        return `
          M
          ${this.xscale(this.allYears[0])}, ${this.yscale(this.selectedNodeValues[0])} 
          C
          ${this.xscale(this.allYears[0])}, ${this.yscale(this.selectedNodeValues[0])},
          ${this.xscale(this.allYears[1])}, ${this.yscale(this.selectedNodeValues[1])},
          ${this.xscale(this.allYears[1])}, ${this.yscale(this.selectedNodeValues[1])}
          S
          ${this.xscale(this.allYears[2])}, ${this.yscale(this.selectedNodeValues[2])},
          ${this.xscale(this.allYears[2])}, ${this.yscale(this.selectedNodeValues[2])}
          L
          ${this.width},${this.height - this.ymargin}
          L
          ${this.xscale(this.allYears[0])},${this.height - this.ymargin}
          L
          ${this.xscale(this.allYears[0])},${this.yscale(this.selectedNodeValues[0])} 
        `
      }
    }
  },
  methods: {
    xTicksTransform (index) {
      return `translate(${this.xTickSize * index}, 0)`
    },
    yTicksTransform (index) {
      return `translate(0, ${this.yTickSize * index})`
    },
    xAxisTransform (year) {
      return `translate(${this.xscale(parseInt(year))}, 0)`
    },
    yAxisTransform (value) {
      return `translate(0, ${this.yscale(value)})`
    },
    formatCurrency (value) {
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
#chart-wrap {
    height: 250px;
}    

.multigrid .tick {
    stroke: lightgray;
    opacity: 1;
}

.multigrid path {
    stroke-width: 1;
}

.area {
    opacity: 0.2;
}

.multiline {
    fill: none;
    stroke-width: 2px;
    opacity: 1;
}

.multiarea {
    fill-opacity: 0.65;
}

.overflows {
    fill: #f9f9f9;
}
</style>
