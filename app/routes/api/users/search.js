// api/users/search.js
import config from '../../../../config/private'
module.exports = (app, config) => {
  app.get('/api/users/search',(req, res) => {
    const api_url = config.api.url
    const q = req.query.q
    const access_token = req.query.access_token
    const query_array = req.query.q.split(' ')
    let query_string = ''
    query_array.forEach(string => {
      if (!query_string)
        query_string = 'q[]=' + string
      else
        query_string += '&q[]=' + string
    })
    const endpoint = api_url + '/users/search?' + query_string
    fetch(endpoint,{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
      }
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          response
        }
        return res.json(error)
      }
      return response.json()
    })
    .then(response => {
      const response_object = {
        ...response,
        status: 'success'
      }
      return res.json(response_object)
    });
  })
}