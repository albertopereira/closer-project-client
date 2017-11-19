import axios from 'axios'

export const getData = function (context, args) {
  return new Promise((resolve, reject) => {
    axios.get('http://closer-project.com/api/view/' + args.budget_id + '/' + args.view_id)
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
