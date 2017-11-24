<template>
  <div id="app" class="container">
    <div class="row header" v-if="jsonData">
      <div class="col-6">
        <div class="header-title">{{ jsonData.key }}</div>
        <div class="header-description">{{ jsonData.descr }}</div>
      </div>
      <div class="col-6">
        <ul class="nav">
          <li class="nav-menu" v-if="hasView('gt')">
            <a href="#" @click.prevent="changeView('gt')" v-bind:class="{ active: activePage === 'gt' }"><i class="fa fa-th-large" aria-hidden="true"></i>Resumo</a>
          </li>
          <li class="nav-menu" v-if="hasView('t')">
            <a href="#" @click.prevent="changeView('t')" v-bind:class="{ active: activePage === 't' }"><i class="fa fa-th-list" aria-hidden="true"></i>Tabela</a>
          </li>
          <li class="nav-menu" v-if="hasView('b')">
            <a href="#" @click.prevent="changeView('b')" v-bind:class="{ active: activePage === 'b' }"><i class="fa fa-th-list" aria-hidden="true"></i>Bubble Tree</a>
          </li>
          <li class="nav-menu" v-if="hasView('m')">
            <a href="#" @click.prevent="changeView('m')" v-bind:class="{ active: activePage === 'm' }"><i class="fa fa-globe" aria-hidden="true"></i>Heatmap</a>
          </li>
          <li>
            <div class="dropdown show">
              <a class="btn btn-sm btn-secondary dropdown-toggle" v-if="year" href="https://example.com" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {{ year }}
              </a>

              <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" v-if="allYears">
                <a class="dropdown-item" v-for="year in allYears" :key="year" href="#" @click.prevent="changeYear(year)">{{ year }}</a>
              </div>
            </div>
          </li>
        </ul>
        
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="main-content">
          <router-view v-if="dataLoaded"/>
        </div>
      </div>
    </div>    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      dataLoaded: false,
      page: 'gt'
    }
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'year',
      'allYears'
    ]
    ),
    activePage () {
      return this.page
    }
  },
  mounted () {
    let args = {
      'budget_id': this.$route.params.budget_id,
      'view_id': this.$route.params.view_id
    }
    this.$store.dispatch('getData', args).then(response => {
      this.dataLoaded = true
    }, error => {
      console.log(error)
    })
  },
  methods: {
    changeView (view) {
      this.page = view
      this.$router.push({params: { view: `${view}`, year: `${this.year}` }})
    },
    changeYear (year) {
      this.$router.push({params: { year: `${year}` }})
    },
    hasView (view) {
      return this.jsonData.view.indexOf(view) > -1
    }
  }
}
</script>

<style scoped>
#app {
  font-family: 'Roboto Condensed', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-content{
  position: relative;
  margin-bottom: 10px;
  padding: 15px;
  text-align: left;
  background-color: #f9f9f9;
  -webkit-box-shadow: 0px 0px 10px #cccccc;
  box-shadow: 0px 0px 10px #cccccc;
}

.header{
  text-align: left;
  padding: 10px;
  margin: 0px;
}

.header-title{
  font-size: 32px;
  line-height: 28px;
  display: inline-block;
}

@media (min-width: 1200px) {
  .container {
    max-width: 1400px;
  }
}

.header .dropdown{
  float: right;
}

.header .dropdown a{
  font-size: .9em;
  margin: 0;
}

.nav{
  margin-top: 10px;
  float:right;
}

.nav li{
  margin-right: 20px;
}

.nav li a{
  font-size: 1.2em;
}

.nav li.nav-menu a{
  color: #0056b3;
}

.nav li.nav-menu a.active{
  color: #007bff;
}

.fa{
  margin-right: 5px;
  font-size: .9em;
}
</style>
