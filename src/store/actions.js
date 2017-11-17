import axios from 'axios'

export const getData = function (context) {
  return new Promise((resolve, reject) => {
    axios.get('http://closer.dev/api/view/1')
      .then(response => {
        context.commit('SET_DATA', response.data)
        resolve(response)
      })
      .catch(e => {
        console.log(e)
        reject(e)
      })
  })
}
