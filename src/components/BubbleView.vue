<template>
  <div class="bubble" ref="bubble">
      <div class="row">
        <div class="col-12">
          <div class="title-header">
            {{ jsonData.descr }}
          </div>
        </div>
      </div>
      <div class="row header">
        <div class="col-12">
          <svg :width="width" :height="height" v-if="selectedNode">
            <line :x1="width / 2" :y1="height / 2" :x2="mouseHoverNodeCoords.x" :y2="mouseHoverNodeCoords.y" stroke="#777777" stroke-width="1" v-if="mouseHoverHash"></line>
            <circle :cx="selectedNode.x" :cy="selectedNode.y" :r="selectedNode.r" style="fill: #ffffff"></circle>
            <circle :cx="selectedNode.x" :cy="selectedNode.y" :r="selectedNode.r + largestRadius(selectedNode.children) + padding" fill="none" stroke="#888888" stroke-dasharray="3,1" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); stroke-opacity: 1;" stroke-opacity="1"></circle>
            <transition-group name="list" tag="g" class="depth">
              <g v-on:click.prevent="selectNode" :class="{ activeNode: selectedNode.hash === mouseHoverHash || mouseHoverHash === null}" :key="selectedNode.hash">
                <circle :id="selectedNode.parent" :cx="selectedNode.x" :cy="selectedNode.y" :r="selectedNode.r" :style="{ 'fill' : selectedNode.color } "></circle>
                <foreignObject 
                  dy="1em" 
                  :id="parent" 
                  :x="selectedNode.x - 75"
                  :y="selectedNode.y - 25" 
                  :style="{ 'font-size' : '1.2em', 'line-height' : '1.2em'}"
                  width="150"
                  height="50"            
                  >
                  <p xmlns="http://www.w3.org/1999/xhtml" style="color: #fefefe" :id="selectedNode.parent" >
                    {{ selectedNode.key }}
                  </p>
                </foreignObject>
              </g>
              <g @mouseleave="mouseHoverHash = null" @mouseenter="mouseHoverHash = node.hash" v-for="(node, index) in selectedNode.children" :class="{ activeNode: node.hash === mouseHoverHash || mouseHoverHash === null}" :key="node.hash" v-on:click.prevent="selectNode">
                <circle 
                  :id="node.hash"
                  :cx="node.x" 
                  :cy="node.y" 
                  :r="node.r"              
                  :style="{ 'fill' : node.color } "
                  ></circle>
                <foreignObject
                  dy="1em"
                  :x="node.x - node.r / 0.5" 
                  :y="node.y - node.r / 4" 
                  :style="{ 'font-size' : fontSize(node.r), 'line-height' : '1em'}"
                  :width="node.r * 4"
                  height="50"
                  >
                  <p xmlns="http://www.w3.org/1999/xhtml" style="color: #444444" :id="node.hash">{{ node.key }}</p>
                </foreignObject>
              </g>
            
            </transition-group>
            <g :class="{ activeNode: mouseHoverHash !== null}">
                <foreignObject 
                  class="details"
                  dy="1em" 
                  :id="parent" 
                  :x="selectedNode.x - 75"
                  :y="selectedNode.y - 50" 
                  :style="{ 'font-size' : '1.2em', 'line-height' : '1.2em'}"
                  width="150"
                  height="50"
                  >
                  <p xmlns="http://www.w3.org/1999/xhtml" style="color: #666666" :id="selectedNode.parent" >
                    <div>{{ mouseHoverNodeKey }} </div>
                    <div style="font-size: 1.3em;">{{ mouseHoverNodeValue }} </div>
                  </p>
                </foreignObject>
              </g>        
          </svg>
        </div>
      </div> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as d3 from 'd3'

export default {
  name: 'Bubble',
  data () {
    return {
      color: null,
      width: 960,
      height: 500,
      padding: 15,
      parent: null,
      selected: null,
      radius: 120,
      mouseHoverHash: null
    }
  },
  mounted () {
    var that = this
    that.color = d3.scaleOrdinal(d3.schemeCategory20)

    that.width = that.$refs.bubble.clientWidth
    that.initialize()
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'year'
    ]
    ),
    weight () {
      return d3.scaleLinear()
        .domain([0, this.nodeValue(this.getNodeByHash(this.jsonData, this.selected, this))])
        .range([0, this.radius])
    },
    mouseHoverNodeKey () {
      if (this.mouseHoverHash) {
        return this.getNodeByHash(this.jsonData, this.mouseHoverHash, this).key
      }
    },
    mouseHoverNodeValue () {
      if (this.mouseHoverHash) {
        return this.formatcurrency(this.nodeValue(this.getNodeByHash(this.jsonData, this.mouseHoverHash, this)))
      }
    },
    mouseHoverNodeCoords () {
      if (this.mouseHoverHash) {
        return {
          x: this.getNodeByHash(this.jsonData, this.mouseHoverHash, this).x,
          y: this.getNodeByHash(this.jsonData, this.mouseHoverHash, this).y
        }
      }
    },
    selectedNode () {
      if (!this.jsonData || !this.color) {
        return false
      }
      // let node = this.jsonData
      let node = this.getNodeByHash(this.jsonData, this.selected, this)
      let i = 0
      node.color = this.color(i)
      node.r = this.radius
      node.x = this.width / 2
      node.y = this.height / 2

      let radius = node.r + this.largestRadius(node.children) + this.padding
      let d = null

      let newLevelNodes = []
      node.children.forEach(el => {
        d = el
        d.color = this.color(++i)

        d.r = this.weight(this.nodeValue(el)) < 20 ? 20 : this.weight(this.nodeValue(el)) > 60 ? 60 : this.weight(this.nodeValue(el))
        d.parent = node.hash

        do {
          let point = this.getRandomPoint(radius, node.x, node.y)
          d.x = point.x
          d.y = point.y
        } while (this.collides(newLevelNodes, d))

        newLevelNodes.push(d)
      })
      // this.$set(this.levelNodes, 'children', newLevelNodes)
      node.children = newLevelNodes
      return node
    }
  },
  methods: {
    initialize () {
      this.selected = this.jsonData.hash
    },
    largestRadius (nodes) {
      let max = 0
      nodes.forEach(element => {
        if (this.weight(this.nodeValue(element)) > max) {
          max = this.weight(this.nodeValue(element))
        }
      })
      return max < 20 ? 20 : max > 60 ? 60 : max
    },
    nodeValue (node) {
      return node.values.filter(el => el.year === this.year)[0].val
    },
    getRandomPoint (radius, cx, cy) {
      var angle = Math.random() * Math.PI * 2
      return {
        x: Math.cos(angle) * radius + cx,
        y: Math.sin(angle) * radius + cy
      }
    },
    collides (nodes, node) {
      let ret = false
      nodes.forEach(element => {
        let distance = Math.hypot(element.x - node.x, element.y - node.y)

        if (distance < (node.r + element.r)) {
          ret = true
        }
      })
      return ret
    },
    getNodeByHash (node, hash, context) {
      if (node.hash === hash) {
        return node
      } else if (node.children) {
        for (var i = 0; i < node.children.length; i++) {
          var nd = context.getNodeByHash(node.children[i], hash, context)
          if (nd) {
            return nd
          }
        }
      }
    },
    selectNode (event) {
      if (event.target.id && this.getNodeByHash(this.jsonData, event.target.id, this).hasOwnProperty('children')) {
        if (event.target.id === this.jsonData.hash) {
          this.parent = null
        } else {
          this.parent = this.selected
        }
        this.selected = event.target.id
        this.mouseHoverHash = null
      }
    },
    fontSize (r) {
      return r * 0.5 > 12 ? 12 : r * 0.5
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
.bubble{
  text-align: center;
  line-height: 0.7em;
}

.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
}

g foreignObject p{
  opacity: 0;
  cursor: pointer;
}

g line{
  opacity: 0;
  cursor: pointer;
  transition: all .5s;
}

g foreignObject.details p{
  opacity: 0;
}

g circle{
  cursor: pointer;
  opacity:0.2;
  transition: all .5s;
}

g.activeNode foreignObject p{
  opacity:1;
}

g.activeNode circle, g.activeNode foreignObject.details p, g.activeNode line{
  opacity:1;
  transition: all .5s;
}
.title-header{
  height: 80px;
  white-space: nowrap;
  font-size: 2.8em;
  color: #000000;
  margin-top: 25px;
  margin-left: 15px;
  text-align:left;
}
</style>