import { DEALS_STATUSES } from './constants'

export interface SearchQuery {
  filter: string
  type: 'query' | 'inbox'
  term: string
}

export type TDealsStatus = keyof typeof DEALS_STATUSES

export type TDateRange = { from: string; to: string }
export type DealsListContext = { date: Partial<TDateRange> }
export type TDealsStatusList = Partial<Record<TDealsStatus, boolean>>
export type TDealsContexts = {
  closing_date?: DealsListContext
  list_date?: DealsListContext
  expiration_date?: DealsListContext
  contract_date?: DealsListContext
  lease_begin?: DealsListContext
  lease_end?: DealsListContext
}
export interface DealsListFilters {
  deal_type?: IDealType[]
  property_type?: IPropertyType[]
  status: TDealsStatusList
  contexts: TDealsContexts
}

export type DealsOrder = [string, 'ASC' | 'DESC']
export interface DealsListPayload extends DealsListFilters {
  query?: string
  $order?: DealsOrder
}
