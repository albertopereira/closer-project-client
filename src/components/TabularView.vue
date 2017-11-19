<template>
    <div class="tabular" ref="cards">
      <div class="row">
        <div class="col-12">
          <div class="title-header">
            {{ jsonData.descr }}
          </div>
        </div>
      </div>
      <div class="row header">
        <div class="col-4">
          Nome
        </div>
        <div class="col-2">
          Crescimento
        </div>
        <div class="col-2">
          Variação (total)
        </div>
        <div class="col-2">
          Impacto
        </div>
        <div class="col-2">
          Valor
        </div>
      </div>
      <tabular-node 
      :nodes="jsonData.children" 
      :depth="0"   
      :label="jsonData.descr"
      :values="jsonData.values"
      impact="100"
      :value="totalValueForYear"
      ></tabular-node>
    </div>
</template>

<script>
import tabularNode from './TabularNode'
import { mapGetters } from 'vuex'

export default {
  name: 'TabularView',
  components: {
    tabularNode
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'totalValueForYear',
      'growth',
      'averagePerYear',
      'allYears',
      'year'
    ]
    )
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabular{
  padding:15px;
}

.tabular .header{
  height: 50px;
  font-size: 1.1em;
  font-weight: bold;
  text-align: left;
  padding:0px;
  margin:0px;
}

.title-header{
  height: 80px;
  white-space: nowrap;
  font-size: 2.8em;
  color: #000000;
  margin-top: -15px;
}


</style>
