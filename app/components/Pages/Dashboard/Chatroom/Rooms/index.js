import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'
import {
  toggleInstanceMode,
  changeActiveRoom,
  toggleChatbar
} from '../../../../../store_actions/chatroom'


const enhance = compose(
  pure,
  withState('filter', 'changeFilter', ''),
  connect(
    ({ chatroom }) => ({
      instanceMode: chatroom.instanceMode,
      showChatbar: chatroom.showChatbar,
      rooms: chatroom.rooms
    }),
    ({ toggleInstanceMode, changeActiveRoom, toggleChatbar })
  )
)

const Rooms = ({
  user,
  instanceMode,
  showChatbar,
  rooms,
  activeRoom,
  onSelectRoom,
  changeFilter,
  filter,
  /* mapped actions to dispatch */
  toggleInstanceMode,
  changeActiveRoom,
  toggleChatbar
}) => {

  /**
   * toggle full screen chatroom
   */
  const fullScreen = e => {
    e.preventDefault()

    // toggle chatroom display
    toggleInstanceMode()

    if (showChatbar) {
      // display first room if there is no active room
      if (!activeRoom) {
        let firstRoomId = rooms[Object.keys(rooms)[0]].id
        changeActiveRoom(firstRoomId)
      }
    }
  }

  /**
   * create room's avatar image
   */
  const getRoomAvatar = room => {
    const size = 30
    const color = '#d7d7d7'
    const { users } = room

    if (room.room_type === 'Group') {
      return <UserAvatar
        name={room.users.length.toString()}
        size={size}
        showStateIndicator={false}
        color={color}
      />
    }

    // get partner data
    const User = room.users.length > 1 ? _.find(room.users, u => u.id !== user.id) : room.users[0]

    return <UserAvatar
      userId={User.id}
      name={User.display_name}
      image={User.profile_image_url}
      size={size}
      color={color}
      borderColor={room.id === activeRoom ? '#2196f3' : '#303E4D' }
    />
  }

  const getRoomTitle = title => {
    const len = 30
    if (title.length <= len)
      return title

    return title.substr(0, len) + '...'
  }

  return (
    <div className="rooms">
      <div className="toolbar">

        <a
          href="/dashboard/recents"
          onClick={e => fullScreen(e)}
          className="toggle-bar"
        >
          {
            instanceMode ?
            <i className="fa fa-angle-double-left fa-2x"></i> :
            <i className="fa fa-angle-double-right fa-2x"></i>
          }
        </a>

        <input
          className="form-control filter"
          type="text"
          placeholder="Search"
          onChange={e => changeFilter(e.target.value)}
          value={filter}
        />
      </div>

      <div className="list-container">
        <div className="section-title">
        </div>
        <div className="list">
          {
            _.chain(rooms)
            .filter(room => room.proposed_title.toLowerCase().startsWith(filter.toLowerCase()))
            .map(room =>
              <Row
                onClick={() => onSelectRoom(room.id)}
                key={`ROOM_CHANNEL_${room.id}`}
                className={cn('item', { active: room.id === activeRoom })}
              >
                <Col sm={1} xs={1} className="avatar">
                  { getRoomAvatar(room) }
                </Col>
                <Col sm={8} xs={8} className="title">
                  { getRoomTitle(room.proposed_title) }
                </Col>

                <Col sm={2} xs={2} className="notifications">
                  {
                    room.new_notifications > 0 &&
                    <span className="count">
                      { room.new_notifications }
                    </span>
                  }
                </Col>
              </Row>
            )
            .value()
          }
        </div>
      </div>
    </div>
  )
}

export default enhance(Rooms)
