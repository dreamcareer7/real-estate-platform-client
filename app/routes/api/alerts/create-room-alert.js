// api/alerts/create-room-alert.js
module.exports = (app, config) => {
  app.post('/api/alerts/create-room-alert',(req, res) => {
    const api_url = config.api.url
    const alert = req.body.alert
    const request_object = alert
    const access_token = req.body.access_token
    const endpoint = api_url + '/rooms/' + alert.room + '/alerts'
    fetch(endpoint,{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
      },
      body: JSON.stringify(request_object)
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
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })

}