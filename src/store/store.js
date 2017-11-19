import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    jsonData: null,
    rootNode: null,
    selectedNode: null
  },
  actions,
  strict: false,
  mutations: {
    SET_DATA (state, data) {
      state.jsonData = data
    },
    SET_ROOT_NODE (state, data) {
      state.rootNode = statistics.setWeights(data)
    },
    SET_SELECTED_NODE (state, data) {
      state.selectedNode = data
    }
  },
  getters: {
    jsonData: state => {
      return state.jsonData
    },
    rootNode: state => {
      return state.rootNode
    },
    selectedNode: state => {
      return state.selectedNode
    },
    totalValueForYear: (state, getters) => {
      return statistics.totalValueForYear(state, getters.year)
    },
    growth: (state, getters) => {
      return statistics.growth(state, getters.year)
    },
    averagePerYear: state => {
      return statistics.averagePerYear(state)
    },
    year: state => {
      if (state.route.params.year === undefined) {
        return state.jsonData.values[0].year
      } else {
        return state.route.params.year
      }
    },
    allYears: state => {
      if (state.jsonData) {
        return state.jsonData.values.map(el => el.year)
      }
    }
  }
})

var statistics = {
  totalValueForYear (state, year) {
    let ret = state.jsonData.values.filter(el => el.year === year.toString())
    return ret.length > 0 ? this.formatCurrency(parseInt(ret[0].val)) : 0
  },
  growth (state, year) {
    let currentYear = state.jsonData.values.filter(el => el.year === year.toString())
    let previousYear = state.jsonData.values.filter(el => el.year === (year - 1).toString())
    previousYear = previousYear.length ? previousYear : [{ 'val': 0 }]
    return (((currentYear[0].val - previousYear[0].val) * 100) / currentYear[0].val).toFixed(2)
  },
  averagePerYear (state) {
    let total = state.jsonData.values.reduce(
      (acc, cur) => acc + cur.val,
      0
    )
    return this.formatCurrency((parseInt(total) / state.jsonData.values.length))
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
  },
  setWeights (node) {
    let total = node.children.reduce(
      (acc, cur) => acc + cur.value,
      0
    )

    let children = node.children.map(function (el) {
      el.weight = (((el.value * 100) / total)).toFixed(2)
      return el
    })

    node.children = children

    return node
  }
}
