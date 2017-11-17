<template>
    <div class="cards" ref="cards">

      <div class="row single-card separator">
        <div class="col-6">
          <div class="card-title">{{ totalValueForYear }}</div>
          <div class="card-descr">em {{ year }}.</div>
        </div>
        <div class="col-6">
          <div class="card-title">{{ growth }}%</div>
          <div class="card-descr">comparado com o ano anterior.</div>
        </div>
      </div>

      <div class="row single-card separator">
        <div class="col-6">
          <div class="card-title">{{ averagePerYear }}</div>
          <div class="card-descr">em média, por ano.</div>
        </div>
      </div>

      <div class="row single-card separator">
        <div class="col-12">
          <div class="card-descr">{{ jsonData.key }} <br/> <a :href="jsonData.src" target="_blank">{{ jsonData.src }}</a></div>
        </div>
      </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CardView',
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

.single-card.separator:after{
    content:' ';
    display: block;
    border: none;
    height: 1px;
    width: 100%;
    background-image: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#cccccc), to(white));
    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    background-image: -ms-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
    margin-top: 10px;
    clear: both;
}

.row:after{
  clear: both;
}

.single-card{
  margin:10px 0px;
}

.card-title{
  font-size: 1.8em;
  font-family: 'Georgia';
  margin: 0px;
  padding: 0px;
  line-height: 1.2;
}

.card-descr{
  font-size: 1.2em;
  color:#888888;
}

</style>
