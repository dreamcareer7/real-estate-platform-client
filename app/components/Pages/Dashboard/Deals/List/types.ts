export interface ClosingDateRange {
  from: number
  to: number
}

export interface ClosingsFilterQuery {
  query: string
  contexts: {
    closing_date: {
      date: {
        from: string
        to: string
      }
    }
  }
}