import React from 'react'
import cn from 'classnames'
import Messages from '../Messages'
import Toolbar from './toolbar'

export default ({
  room,
  settings,
  number,
  user,
  onMinimize,
  onMaximize,
  onClose,
  onChangeActive
}) => {

  if (number > 4)
    return false

  // extract settings
  const { minimize, isActive } = settings

  const width = 270 // pixels
  const defaultLeft = 90 // pixel

  let left = (width * (number - 1)) + defaultLeft

  // margin left
  if (number > 1)
    left += 20 * (number - 1)

  return (
    <div
      className={cn('chat-popup', { minimize })}
      onClick={() => onChangeActive(room.id)}
      style={{
        width: `${width}px`,
        left: `${left}px`
      }}
    >
      <Toolbar
        room={room}
        isActive={isActive}
        onMinimize={onMinimize}
        onMaximize={onMaximize}
        onClose={onClose}
      />

      <Messages
        user={user}
        roomId={room.id}
        showToolbar={false}
        isPopup={true}
      />
    </div>
  )
}
