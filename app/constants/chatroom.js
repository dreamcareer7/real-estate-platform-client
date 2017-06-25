const ActionTypes = {}

new Array(
  'CHANGE_STATUS',
  'TOGGLE_CHATBAR',
  'TOGGLE_INSTANCE_MODE',

  'GET_ROOMS',
  'CREATE_ROOM',
  'LEAVE_ROOM',
  'CHANGE_ACTIVE_ROOM',
  'ADD_MEMBERS',
  'ACKNOWLEDGE_ROOM',

  'ADD_POPUP',
  'MINIMIZE_POPUP',
  'MAXIMIZE_POPUP',
  'CHANGE_ACTIVE_POPUP',
  'REMOVE_POPUP',

  'GET_MESSAGES',
  'CREATE_MESSAGE',
  'ADD_MESSAGE_TYPING',
  'REMOVE_MESSAGE_TYPING',
  'UPDATE_MESSAGE_DELIVERIES',

  'INITIAL_USER_STATES',
  'UPDATE_USER_STATE',

  'UPDATE_ROOM_NOTIFICATIONS',
  'RESET_ROOM_NOTIFICATIONS',
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
