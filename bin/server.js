import server from '../server'

const port = 8080
server.listen(port, () =>
  console.log('App is started on 0.0.0.0:' + port))
