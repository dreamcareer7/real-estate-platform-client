import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Rooms from '../Rooms'
import { addChatPopup, toggleChatbar } from '../../../../../store_actions/chatroom'

const Chatbar = ({
  showChatbar,
  /* mapped actions to dispatch */
  addChatPopup,
  toggleChatbar
}) => {

  return (
    <Menu
      noOverlay={false}
      isOpen={showChatbar}
      customBurgerIcon={false}
      customCrossIcon={false}
      width={"26%"}
      onStateChange={({ isOpen }) => {
        if (showChatbar !== isOpen) {
          toggleChatbar()
        }
      }}
    >
      <Rooms
        onSelectRoom={roomId => {
          addChatPopup(roomId)
          toggleChatbar()
        }}
      />
    </Menu>
  )
}

export default connect(({ chatroom }) => ({
  showChatbar: chatroom.showChatbar
}), ({ addChatPopup, toggleChatbar }))(Chatbar)
