import React, { useContext } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'

import { ListContext } from '../../context'

import { EventContainer } from '../components/EventContainer'

import styles from '../styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      sending: {
        opacity: 0.4
      }
    }),
  { name: 'EmailCampaign' }
)

export function EmailCampaign({ style, event, nextItem }: Props) {
  const { setSelectedEvent } = useContext(ListContext)
  const handleContainerClick = () => setSelectedEvent(event)

  const classes = useStyles()
  const sending =
    event.event_type === 'scheduled_email' &&
    event.timestamp * 1000 < Date.now()

  return (
    <EventContainer
      style={style}
      classes={{ root: sending ? classes.sending : '' }}
      event={event}
      nextItem={nextItem}
      icon={{
        color: eventIcons.Email.color,
        element: eventIcons.Email.icon
      }}
      title={
        <div>
          <a
            style={styles.link}
            onClick={e => {
              e.preventDefault()
              setSelectedEvent(event)
            }}
          >
            {event.title || 'No Subject'}
            {sending && ' (sending ...)'}
          </a>
        </div>
      }
      onClick={handleContainerClick}
    />
  )
}
