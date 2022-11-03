import {
  Box,
  Button,
  makeStyles,
  Theme,
  CircularProgress
} from '@material-ui/core'
import cn from 'classnames'

import { CrmEventType } from '../../../types'
import { EmptyState } from '../EmptyState'
import { Event } from '../Event'
import { EventHeader } from '../EventHeader'

const useStyles = makeStyles(
  (theme: Theme) => ({
    eventHeaderContainer: {
      minWidth: theme.spacing(12),
      maxWidth: theme.spacing(13.5)
    },
    eventsSectionContainer: {
      display: 'flex',
      flexDirection: 'column',
      letterSpacing: '0.15px',
      marginBottom: theme.spacing(3)
    },
    eventsListContainer: {
      width: '100%'
    },
    eventContainer: {
      width: '100%',
      flex: '1 1 auto',
      backgroundColor: '#fff',
      border: `1px solid ${theme.palette.action.disabledBackground}`,
      borderBottomWidth: 0,
      '&:first-child': {
        borderTopLeftRadius: theme.spacing(0.5)
      },
      '&:last-child': {
        borderBottomWidth: '1px',
        borderBottomLeftRadius: theme.spacing(0.5)
      },
      '&:nth-child(even)': {
        backgroundColor: theme.palette.grey['50']
      },
      '&:hover': {
        backgroundColor: theme.palette.grey['100']
      }
    },
    mainContainer: {
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    calendarContainer: {
      position: 'absolute',
      overflowY: 'auto',
      zIndex: 1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    progressLoaderContainer: {
      position: 'absolute',
      zIndex: 10,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.palette.background.paper,
      opacity: 0.6
    },
    progressLoaderIcon: {
      position: 'absolute',
      top: '20%',
      left: '50%'
    },
    loadButton: {
      color: theme.palette.grey['800'],
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  }),
  {
    name: 'CalendarList'
  }
)

interface Props {
  rows: ICalendarListRow[]
  isLoading: boolean
  isReachedEnd: boolean
  isReachedStart: boolean
  onLoadPreviousEvents: () => void
  onLoadNextEvents: () => void
  handleEventChange: (event: IEvent, type: CrmEventType) => void
  eventType?: 'upcoming' | 'history'
}

export function EventLoader({
  rows,
  isLoading,
  isReachedEnd,
  isReachedStart,
  onLoadNextEvents,
  handleEventChange,
  onLoadPreviousEvents,
  eventType
}: Props) {
  const classes = useStyles()

  const Loader = () =>
    isLoading && (
      <Box className={classes.progressLoaderContainer}>
        <CircularProgress className={classes.progressLoaderIcon} />
      </Box>
    )

  if (rows.length === 0) {
    return (
      <Box className={classes.mainContainer}>
        {Loader()}
        {!isLoading && <EmptyState />}
      </Box>
    )
  }

  return (
    <Box className={classes.mainContainer}>
      {Loader()}
      <Box className={classes.calendarContainer}>
        <Box>
          {rows.map((section, index) => (
            <Box
              className={cn(classes.eventsSectionContainer, {
                isToday: section.header.isToday
              })}
              key={`${section.header.date}-${index}`}
            >
              <Box className={classes.eventHeaderContainer}>
                <EventHeader item={section.header} />
              </Box>

              <Box className={classes.eventsListContainer}>
                {section.events.map(event => (
                  <div key={event.id} className={classes.eventContainer}>
                    <Event event={event} onEventChange={handleEventChange} />
                  </div>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        {!isReachedStart && eventType === 'history' && (
          <Box my={2} textAlign="left">
            <Button
              variant="text"
              className={classes.loadButton}
              size="small"
              disabled={isLoading}
              onClick={onLoadPreviousEvents}
            >
              Fetch previous events
            </Button>
          </Box>
        )}
        {!isReachedEnd && eventType === 'upcoming' && (
          <Box my={2} textAlign="left">
            <Button
              variant="text"
              className={classes.loadButton}
              size="small"
              disabled={isLoading}
              onClick={onLoadNextEvents}
            >
              Fetch next events
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
