import moment from 'moment'

/**
 * create a key for the given event
 * @param {Object} event - event
 */
function createEventKey(event) {
  const eventTime = moment.unix(event.timestamp)

  if (!event.recurring) {
    return eventTime.format('YYYY-MM-DD')
  }

  return `${moment().format('YYYY')}-${eventTime.format('MM-DD')}`
}

/**
 * creates days template
 * @param {Object} fromUnix - start date
 * @param {Object} toUnix - end date
 */
function getDays(fromUnix, toUnix) {
  const days = {}
  const cursor = moment.unix(fromUnix).utcOffset(0)
  const toDate = moment.unix(toUnix).utcOffset(0)

  while (cursor.isBefore(toDate)) {
    days[cursor.format('YYYY-MM-DD')] = []
    cursor.add(1, 'day')
  }

  return days
}

export function normalizeByDays(fromUnix, toUnix, calendar) {
  const days = getDays(fromUnix, toUnix)

  calendar &&
    calendar.forEach(event => {
      const key = createEventKey(event)

      days[key] = [...(days[key] || []), event.id]
    })

  return days
}