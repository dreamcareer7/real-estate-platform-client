// models/Message.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'

import config from '../../config/public'

export default {
  
  create: (params, callback) => {
    
    let api_host = params.api_host
    if(!api_host) api_host = config.app.url

    // If no comment
    if(!params.comment.trim())
      return false

    const create_room_url = api_host + '/api/create-message'

    const request_object = {
      room_id: params.room_id,
      comment: params.comment,
      message_type: params.message_type,
      author: params.author,
      access_token: params.access_token
    }

    fetch(create_room_url,{
      method: 'post',
      headers: {  
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        let error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then((response) => {
      return callback(false, response)
    })
  }
}