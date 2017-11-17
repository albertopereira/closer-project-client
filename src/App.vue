<template>
  <div id="app" class="container">
    <div class="row header">
      <div class="col-6">
        <div class="header-title" v-if="jsonData">{{ jsonData.key }}</div>
        <div class="header-description" v-if="jsonData">{{ jsonData.descr }}</div>
      </div>
      <div class="col-6">
        <div class="dropdown show">
          <a class="btn btn-sm btn-secondary dropdown-toggle" v-if="year" href="https://example.com" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {{ year }}
          </a>

          <div class="dropdown-menu" aria-labelledby="dropdownMenuLink" v-if="allYears">
            <a class="dropdown-item" v-for="year in allYears" href="#" @click.prevent="changeYear(year)">{{ year }}</a>
          </div>
        </div>
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
      dataLoaded: false
    }
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'year',
      'allYears'
    ]
    )
  },
  mounted () {
    this.$store.dispatch('getData').then(response => {
      this.dataLoaded = true
    }, error => {
      console.log(error)
    })
  },
  methods: {
    changeYear (year) {
      this.$router.push({ path: `/${year}` })
    }
  }
}
</script>

<style>
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
    max-width: 1600px;
  }
}

.header .dropdown{
  float: right;
}
</style>
