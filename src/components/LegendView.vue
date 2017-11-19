<template>
    <div class="legend" ref="legend">

      <div class="row legend" v-if="rootNode">
        <div class="col-12 legend-wrap" v-for="(child, index) in rootNode.children">
          <div class="legend-label" :style="{ 'background-color': color(index)}"></div>
          <div class="legend-text">{{ child.key }} ({{ child.weight }}% do total)</div>
        </div>
      </div>

    </div>
</template>

<script>
import * as d3 from 'd3'
import { mapGetters } from 'vuex'

export default {
  name: 'LegendView',
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'rootNode'
    ]
    ),
    color () {
      return d3.scaleOrdinal(d3.schemeCategory20)
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .legend{
    padding:15px;
  }

  .legend-wrap{
    line-height: 1.4em;
  }

  .legend-label{
    width: 16px;
    height: 16px;
    border-radius: 8px;
    float:left;
    margin-right: 10px;
    margin-top: 3px;
  }

  .legend-text{
    font-size: .9em;
  }

</style>
