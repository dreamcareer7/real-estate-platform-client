import io from 'socket.io-client'
import moment from 'moment'
import Rx from 'rxjs/Rx'
import store from '../../stores'
import {
  createMessage,
  addMessageTyping,
  removeMessageTyping,
  updateRoomNotifications,
  resetRoomNotificationsCounter,
  initialStates,
  updateState,
  changeSocketStatus
} from '../../store_actions/chatroom'

import config from '../../../config/public'

export default class Socket {
  static authenicated = false

  constructor(user) {
    // set user
    this.user = user

    // create socket
    const socket = io(config.socket.server, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999
    })

    // bind socket to window
    window.socket = socket

    // create authentication
    if (this.user)
      Socket.authenicate(user.access_token)

    // bind Notification
    socket.on('Notification', this.onNotification.bind(this))

    // bind User.Typing
    socket.on('User.Typing', this.onUserTyping.bind(this))

    // bind User.TypingEnded
    socket.on('User.TypingEnded', this.onUserTypingEnded.bind(this))

    // bind Message.Sent
    socket.on('Message.Sent', this.onNewMessage.bind(this))

    // bind Reconnecting and Reconnect socket
    socket.on('reconnecting', this.onReconnecting)
    socket.on('reconnect', this.onReconnect)

    // get all user states
    socket.on('Users.States', this.onUserStates)

    // update user state
    Rx
    .Observable
    .fromEvent(socket, 'User.State', (state, user_id) => {
      return { state, user_id }
    })
    .distinctUntilChanged((p, c) => p.user_id === c.user_id && p.state === c.state )
    .subscribe(this.onUserState)

    // bind ping
    socket.on('ping', this.onPing)
  }

  /**
   * authenticate user
   */
  static authenicate(access_token) {
    socket.emit('Authenticate', access_token, (err, user) => {
      if (err) return false

      if (user && user.access_token === access_token)
        Socket.authenicated = true
    })
  }

  /**
   * emit User.Typing to server
   */
  static userIsTyping(roomId) {
    window.socket.emit('User.Typing', roomId)
  }

  /**
   * emit User.TypingEnded to server
   */
  static userTypingEnded(roomId) {
    window.socket.emit('User.TypingEnded', roomId)
  }

  /**
   * clear room notifications
   */
  static clearNotifications(roomId) {
    window.socket.emit('Room.Acknowledge', roomId)
    store.dispatch(resetRoomNotificationsCounter(roomId))
  }

  /**
   * create new notification
   */
  static createNotification(roomId, message) {
    store.dispatch(updateRoomNotifications(roomId, message))

    // play sound
    const audio = document.getElementById('chatroom-new-message')

    if (audio) {
      audio.play()
    }
  }

  /**
   * send new message
   */
  static sendMessage(roomId, message, authorName = '') {
    return new Promise((resolve, reject) => {
      const unixtime = moment().unix()
      const qid = 'queued_' + unixtime

      const tempMessage = {
        ...message,
        ...{
          id: qid,
          author: {
            abbreviated_display_name: authorName
          },
          queued: true,
          created_at: unixtime,
          updated_at: unixtime,
        }
      }

      // create temporary message
      Socket.createMessage(roomId, tempMessage)

      // resolve
      resolve(tempMessage)

      window.socket.emit('Message.Send', roomId, message, (err, message) => {
        if (err) return reject(err)
        Socket.createMessage(roomId, message, qid)
      })
    })
  }

  /**
   * on receive new notification
   */
  onNotification(notification) {
    // TODO:
  }

  /**
   * on send / receive new message
   */
  onNewMessage(room, message) {
    const { messages, activeRoom } = store.getState().chatroom
    const list = messages[room.id] ? messages[room.id].list : null

    if (activeRoom && room.id === activeRoom)
      Socket.clearNotifications(room.id)

    if (room.id !== activeRoom && this.user.id !== message.author.id) {
      Socket.createNotification(room.id, message)
    }

    // do not dispatch when message is created
    if (!list || (list && list[message.id]))
      return false

    Socket.createMessage(room.id, message)
  }

  /**
   * get all states
   */
  onUserStates(states) {
    store.dispatch(initialStates(states))
  }

  /**
   * on change user state
   */
  onUserState({ state, user_id }) {
    store.dispatch(updateState(user_id, state))
  }

  /**
   * on reconnecting
   */
  onReconnecting() {
    store.dispatch(changeSocketStatus('reconnecting'))
    console.log('--- ON RECONNECTING ---')
  }

  /**
   * on reconnect
   */
  onReconnect() {
    store.dispatch(changeSocketStatus('connected'))
    console.log('--- ON RECONNECTED ---')
  }

  /**
   * on ping
   */
  onPing(callback) {
    if (callback) {
      callback(null, new Date())
    }
  }

  /**
   * create new message and store
   */
  static createMessage(roomId, message, queueId) {
    store.dispatch(createMessage(roomId, { [message.id]: message }, queueId))
  }

  /**
   * income event when a user started typing
   */
  onUserTyping({room_id, user_id}) {
    if (user_id !== this.user.id)
      store.dispatch(addMessageTyping(room_id, user_id))
  }

  /**
   * income socket event when user typing has been ended
   */
  onUserTypingEnded({user_id, room_id}) {
    if (user_id !== this.user.id)
      store.dispatch(removeMessageTyping(room_id, user_id))
  }
}
