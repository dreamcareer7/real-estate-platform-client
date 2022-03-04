import { useQueryState } from 'use-location-state'

import { DEALS_LIST_DEFAULT_FILTERS } from '../../constants'
import { DealsListFilters } from '../../types'

import {
  parseStatusFilterString,
  parseRangeDateFilterString,
  arrayifyRangeDateFilter
} from './utils'

export const UseFiltersWithQuery = (): [
  DealsListFilters,
  (newFilters: Partial<DealsListFilters>) => void
] => {
  const [dealType, setDealType] = useQueryState(
    'dealType',
    DEALS_LIST_DEFAULT_FILTERS.deal_type || []
  )
  const [propertyType, setPropertyType] = useQueryState(
    'propertyType',
    DEALS_LIST_DEFAULT_FILTERS.property_type || []
  )
  const [status, setStatus] = useQueryState<string[]>('status', [])

  const [closingDate, setClosingDate] = useQueryState<[string, string] | []>(
    'closingDate',
    []
  )
  const [listDate, setListDate] = useQueryState<[string, string] | []>(
    'listDate',
    []
  )
  const [expirationDate, setExpirationDate] = useQueryState<
    [string, string] | []
  >('expirationDate', [])
  const [contractDate, setContractDate] = useQueryState<[string, string] | []>(
    'contractDate',
    []
  )
  const [leaseBegin, setLeaseBegin] = useQueryState<[string, string] | []>(
    'leaseBegin',
    []
  )
  const [leaseEnd, setLeaseEnd] = useQueryState<[string, string] | []>(
    'leaseEnd',
    []
  )

  const userFilters: DealsListFilters = {
    ...DEALS_LIST_DEFAULT_FILTERS,
    ...(dealType
      ? {
          deal_type: dealType as IDealType[]
        }
      : {}),
    ...(propertyType.length
      ? {
          property_type: propertyType as UUID[]
        }
      : {}),
    status: {
      ...DEALS_LIST_DEFAULT_FILTERS.status,
      ...(status.length ? parseStatusFilterString(status) : {})
    },
    contexts: {
      ...DEALS_LIST_DEFAULT_FILTERS.contexts,
      ...(closingDate.length
        ? { closing_date: parseRangeDateFilterString(closingDate) }
        : {}),
      ...(listDate.length
        ? { list_date: parseRangeDateFilterString(listDate) }
        : {}),
      ...(expirationDate.length
        ? {
            expiration_date: parseRangeDateFilterString(expirationDate)
          }
        : {}),
      ...(contractDate.length
        ? {
            contract_date: parseRangeDateFilterString(contractDate)
          }
        : {}),
      ...(leaseBegin.length
        ? {
            lease_begin: parseRangeDateFilterString(leaseBegin)
          }
        : {}),
      ...(leaseEnd.length
        ? {
            lease_end: parseRangeDateFilterString(leaseEnd)
          }
        : {})
    }
  }

  const setUserFilters = (newFilters: Partial<DealsListFilters>) => {
    const changedKeys = Object.keys(newFilters)

    changedKeys.forEach(changedKey => {
      switch (changedKey) {
        case 'deal_type':
          setDealType(newFilters.deal_type as IDealType[])
          break
        case 'property_type':
          setPropertyType(newFilters.property_type as UUID[])
          break
        case 'status':
          setStatus(
            newFilters.status
              ? Object.keys(newFilters.status).filter(
                  key => newFilters.status && !!newFilters.status[key]
                )
              : []
          )
          break
        case 'contexts':
          setContext(newFilters.contexts)
          break
        default:
          break
      }
    })
  }

  const setContext = (newContexts?: Partial<DealsListFilters['contexts']>) => {
    if (!newContexts || !Object.keys(newContexts).length) {
      setClosingDate([])
      setListDate([])
      setExpirationDate([])
      setContractDate([])
      setLeaseBegin([])
      setLeaseEnd([])

      return
    }

    const changedKeys = Object.keys(newContexts)

    changedKeys.forEach(changedKey => {
      switch (changedKey) {
        case 'closing_date':
          setClosingDate(arrayifyRangeDateFilter(newContexts.closing_date))
          break
        case 'list_date':
          setListDate(arrayifyRangeDateFilter(newContexts.list_date))
          break
        case 'expiration_date':
          setExpirationDate(
            arrayifyRangeDateFilter(newContexts.expiration_date)
          )
          break
        case 'contract_date':
          setContractDate(arrayifyRangeDateFilter(newContexts.contract_date))
          break
        case 'lease_begin':
          setLeaseBegin(arrayifyRangeDateFilter(newContexts.lease_begin))
          break
        case 'lease_end':
          setLeaseEnd(arrayifyRangeDateFilter(newContexts.lease_end))
          break
        default:
          break
      }
    })
  }

  return [userFilters, setUserFilters]
}
