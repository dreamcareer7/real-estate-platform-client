import moment from 'moment'
import emojify from 'emojify.js'
import _ from 'underscore'
import linkifyString from 'linkifyjs/string'
import store from '../../../../../stores'
import { createMessage } from '../../../../../store_actions/chatroom'
import Mention from './mention'

export default class Message {
  constructor() {
    emojify.setConfig({
      img_dir: '/static/images/emoji'
    })
  }

  /**
   * send new message
   */
  static send(roomId, message, author = {}) {
    const { abbreviated_display_name } = author

    return new Promise((resolve, reject) => {
      const unixtime = moment().unix()
      const qid = 'queued_' + unixtime

      const tempMessage = {
        ...message,
        ...{
          id: qid,
          author: {
            abbreviated_display_name: abbreviated_display_name,
            ...author
          },
          queued: true,
          created_at: unixtime,
          updated_at: unixtime,
        }
      }

      // create temporary message
      Message.create(roomId, tempMessage)

      // resolve
      resolve(tempMessage)

      window.socket.emit('Message.Send', roomId, message, (err, message) => {
        if (err) return reject(err)
        Message.create(roomId, message, qid)
      })
    })
  }

  /**
   * create new message and store
   */
  static create(roomId, message, queueId = null) {
    store.dispatch(createMessage(roomId, { [message.id]: message }, queueId))
  }

  /**
   * get message text
   */
  static getText(message, members, user) {
    let text = message.comment

    if (message.comment) {
      text = emojify.replace(linkifyString(message.comment))
      text = Mention.highlight(text, message.mentions, members, user)
    }

    return text
  }

  /**
   * check message is alert and then return the alert object
   */
  static isAlert(message) {
    const { notification } = message

    if (notification && notification.objects && notification.object_class === 'Alert') {
      return notification.objects[0]
    }

    return false
  }

  /**
   * get message author
   */
  static getAuthor(message) {
    if (!message)
      return null

    if (message.author)
      return message.author

    const alert = Message.isAlert(message)
    if (alert)
      return alert.created_by

    // test for listing without message
    if (message.notification &&
      message.notification.subjects &&
      message.notification.subjects[0].type === 'user'
    ) {
      return message.notification.subjects[0]
    }

    return null
  }

  /**
   * get message date
   */
  static getYMD(message) {
    if (!message)
      return null

    return moment.unix(message.created_at).format('YMMD')
  }

  /**
   * get message date
   */
  static getDate(message, format = '') {
    return moment.unix(message.created_at).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: format,
      sameElse: format
    })
  }
}
