// models/Notification.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import config from '../../config/public'

export default {
  getAll: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/get-notifications?access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  },
  deleteAll: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/delete-notifications?access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response
    })
    .then(response => callback(false, response))
  },
  deleteRoomNotifs: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/delete-room-notifications?room=${params.id}&access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response
    })
    .then(response => callback(false, response))
  },
  markSeen: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/mark-notification-seen?id=${params.id}&access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response
    })
    .then(response => callback(false, response))
  },
  getSummary: (params, callback) => {
    let api_host = params.api_host
    if (!api_host) api_host = config.app.url
    const endpoint = `${api_host}/api/get-notification-summary?access_token=${params.access_token}`
    fetch(endpoint)
    .then((response) => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response.json()
    })
    .then(response => callback(false, response))
  }
}
