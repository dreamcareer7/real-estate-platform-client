import addDays from 'date-fns/addDays'

import { ClosingDateRange, ClosingsFilterQuery } from '../types'

export function getClosingDateRange(days: number = 14): ClosingDateRange {
  return {
    from: new Date().getTime() / 1000,
    to: addDays(new Date(), days).getTime() / 1000
  }
}

export function getClosingsFilterQuery(
  query: string,
  days: number = 14
): ClosingsFilterQuery {
  return {
    query,
    contexts: {
      closing_date: {
        date: {
          from: new Date().toISOString(),
          to: addDays(new Date(), days).toISOString()
        }
      }
    }
  }
}