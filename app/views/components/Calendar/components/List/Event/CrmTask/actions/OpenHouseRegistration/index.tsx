import React from 'react'

import Button from '@material-ui/core/Button'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'
import { getActiveTeamId } from 'utils/user-teams'

interface Props {
  event: ICalendarEvent
}

export function OpenHouseRegistration({ event }: Props) {
  const user = useSelector(selectUser)

  if (event.event_type !== 'Open House') {
    return null
  }

  return (
    <Button
      href={`/openhouse/${event.crm_task}/${getActiveTeamId(user)}/register`}
      target="_blank"
    >
      Guest Registration Page
    </Button>
  )
}
