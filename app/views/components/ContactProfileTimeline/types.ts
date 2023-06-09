import { FilterQuery } from 'models/calendar/get-calendar'

export interface CalendarRef {
  refresh(reset: boolean, range: Nullable<Partial<ICalendarRange>>): void
  updateCrmEvents(event: IEvent, type: string): void
}

export interface ApiOptions {
  range: ICalendarRange
  position: 'Next' | 'Previous' | 'Middle'
  filter?: FilterQuery
  associations?: string[]
  users?: UUID[]
}

export interface FetchOptions {
  reset?: boolean
  calendarRange?: ICalendarRange
}

export type CrmEventType = 'created' | 'deleted' | 'updated'
