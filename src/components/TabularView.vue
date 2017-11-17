<template>
    <div class="treemap" ref="treemap">
      <svg :height="height" style="margin-left: 0px;" :width="width">
      <g style="shape-rendering: crispEdges;" transform="translate(0,20)">
        <transition-group name="list" tag="g" class="depth">
          <g class="children" v-for="(children, index) in selectedNode._children" :key="'c_' + children.id" v-if="selectedNode">

            <rect v-for="child in children._children" class="child" :id="child.id" :key="child.id" :height="y(child.y1) - y(child.y0)" :width="x(child.x1) - x(child.x0)" :x="x(child.x0)" :y="y(child.y0)">
              <title>{{ child.data.key }} | {{ child.value }}</title>
            </rect>

            <rect class="parent" v-on:click.prevent="selectNode" :id="children.id" :key="children.id" :x="x(children.x0)" :y="y(children.y0)" :width="x(children.x1 - children.x0 + children.parent.x0)" :height="y(children.y1 - children.y0 + children.parent.y0)" :style="{ fill: color(index) }">
              <title>{{ children.data.key }} | {{ formatcurrency(children.value) }}</title>
            </rect>

            <text dy="1em" :key="'t_' + children.id" :x="x(children.x0) + 6" :y="y(children.y0) + 6" style="fill-opacity: .7;">{{ children.data.key }}</text>
            <text dy="2.25em" :key="'t_' + children.id" :x="x(children.x0) + 6" :y="y(children.y0) + 6" style="fill-opacity: .7;">{{ formatcurrency(children.value) }}</text>

          </g>
        </transition-group>
        <g class="grandparent">
          <rect :height="margin.top" :width="width" :y="(margin.top * -1)" v-on:click="selectNode" :id="parentId"></rect>
          <text dy=".65em" x="6" y="-14" style="fill-opacity: .7;">
            {{ selectedNode.id }}
          </text>
        </g>
      </g></svg>
    </div>
</template>

<script>
import * as d3 from 'd3'
import { mapGetters } from 'vuex'

export default {
  name: 'TabularView',
  data () {
    return {
      rootNode: {},
      margin: {
        top: 20,
        right: 0,
        bottom: 0,
        left: 0
      },
      width: 0,
      height: 460,
      formatNumber: d3.format(',d'),
      selected: null,
      color: {}
    }
  },
  watch: {
    selectedNode (newData, oldData) {
      this.$store.commit('SET_SELECTED_NODE', newData)
    },
    year () {
      this.initialize()
      this.accumulate(this.rootNode, this)
      this.treemap(this.rootNode)
    }
  },
  mounted () {
    var that = this
    that.color = d3.scaleOrdinal(d3.schemeCategory20)

    this.$nextTick(() => {
      that.width = that.$refs.treemap.clientWidth
      that.initialize()
      that.accumulate(that.rootNode, that)
      that.treemap(that.rootNode)
    })
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'year'
    ]
    ),
    parentId () {
      if (this.selectedNode.parent === undefined || this.selectedNode.parent === null) {
        return this.selectedNode.id
      } else {
        return this.selectedNode.parent.id
      }
    },
    x () {
      return d3.scaleLinear()
        .domain([0, this.width])
        .range([0, this.width])
    },
    y () {
      return d3.scaleLinear()
        .domain([0, this.height - this.margin.top - this.margin.bottom])
        .range([0, this.height - this.margin.top - this.margin.bottom])
    },
    treemap () {
      return d3.treemap()
      .size([this.width, this.height])
      .round(false)
      .paddingInner(0)
    },
    selectedNode () {
      let node = null

      if (this.selected) {
        let nd = this.getNodeById(this.rootNode, this.selected, this)

        if (nd._children) {
          node = nd
        } else {
          node = nd.parent
        }
      } else {
        node = this.rootNode
      }

      this.x.domain([node.x0, node.x0 + (node.x1 - node.x0)])
      this.y.domain([node.y0, node.y0 + (node.y1 - node.y0)])

      this.$store.commit('SET_SELECTED_NODE', node)

      return node
    },
    indexOfYear () {
      return this.jsonData.values.map(function (el) { return el.year }).indexOf(this.year)
    }
  },
  methods: {
    initialize () {
      let that = this

      if (that.jsonData) {
        that.rootNode = d3.hierarchy(that.jsonData)
        .eachBefore(function (d) {
          d.id = (d.parent ? d.parent.id + '.' : '') + d.data.key
          d.key = d.data.key
          d.values = d.data.values
        })
        .sum((d) => d.values[this.indexOfYear].val)
        .sort(function (a, b) {
          return b.height - a.height || b.value - a.value
        })
        that.rootNode.x = that.rootNode.y = 0
        that.rootNode.x1 = that.width
        that.rootNode.y1 = that.height
        that.rootNode.depth = 0

        this.$store.commit('SET_ROOT_NODE', that.rootNode)
      }
    },
    accumulate (d, context) {
      d._children = d.children

      if (d._children) {
        d.value = d._children.reduce(function (p, v) { return p + context.accumulate(v, context) }, 0)
        return d.value
      } else {
        return d.value
      }
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
    },
    getNodeById (node, id, context) {
      if (node.id === id) {
        return node
      } else if (node._children) {
        for (var i = 0; i < node._children.length; i++) {
          var nd = context.getNodeById(node._children[i], id, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    selectNode (event) {
      this.selected = event.target.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.gtview-container{
  padding: 0px 0px;
}

text {
  pointer-events: none;
}

.grandparent text {
  font-weight: bold;
}

rect {
  fill: none;
  stroke: #fff;
}

rect.parent,
.grandparent rect {
  stroke-width: 2px;
}

.grandparent rect {
  fill: orange;
}

.grandparent:hover rect {
  fill: #ee9700;
}

.children rect.parent,
.grandparent rect {
  cursor: pointer;
}

.children rect.parent {
  fill: #bbb;
  fill-opacity: .5;
}

.children:hover rect.child {
  fill: #bbb;
}

.children text{
  font-size: 0.8em;
}

.grandparent text{
  font-size: 0.9em;
}

.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}

.treemap{
  right: 10px;
}
    
</style>
