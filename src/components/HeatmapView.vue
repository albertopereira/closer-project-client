<template>
    <div class="heatmap" ref="heatmap">
      <div class="row">
        <div class="col-12">
          <div class="title-header">
            {{ jsonData.descr }}
          </div>
        </div>
      </div>
      <div class="row">
          <div class="col-12">
            <div id="heatmap_container"></div>
          </div>
      </div>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HeatmapView',
  data () {
    return {
      map: null,
      heatmap: null,
      coords: []
    }
  },
  mounted () {
    this.map = new google.maps.Map(document.getElementById('heatmap_container'), {
      zoom: 13,
      center: {lat: parseFloat(this.jsonData.coords.split(',')[0]), lng: parseFloat(this.jsonData.coords.split(',')[1])},
      mapTypeId: 'satellite'
    })

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.getPoints,
      map: this.map,
      radius: 50
    })
  },
  computed: {
    ...mapGetters([
      'jsonData',
      'totalValueForYear',
      'growth',
      'averagePerYear',
      'year'
    ]
    ),
    getPoints () {
      let points = []

      this.getCoords(this.jsonData.children)

      for (var i = 0; i < this.coords.length; i++) {
        points[i] = new google.maps.LatLng(this.coords[i][0], this.coords[i][1])
      }

      return points
    }
  },
  methods: {
    getCoords (obj) {
      for (var i in obj) {
        if (obj[i].hasOwnProperty('coords')) {
          this.coords.push(obj[i].coords.split(',').map(function (item) { return item.trim() }))
        }

        if (obj[i].hasOwnProperty('children')) {
          this.getCoords(obj[i].children)
        }
      }
    }
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
  margin:15px 0px 0px 15px;
}

.card-title{
  font-size: 1.5em;
  font-family: 'Georgia';
  margin: 0px;
  padding: 0px;
  line-height: 1;
}

.card-descr{
  font-size: 1em;
  color:#888888;
}

#heatmap_container{
  height: 400px;
}


.title-header{
  height: 80px;
  white-space: nowrap;
  font-size: 2.8em;
  margin-left: 15px;
  color: #000000;
}

</style>
