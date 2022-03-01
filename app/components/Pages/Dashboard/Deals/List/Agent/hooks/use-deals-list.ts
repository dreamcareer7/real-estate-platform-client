import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { useBrandStatuses } from '@app/hooks/use-brand-statuses'
import { IAppState } from '@app/reducers'
import { selectUser } from '@app/selectors/user'
import { getActiveTeamId } from '@app/utils/user-teams'
import {
  isActiveDeal,
  isArchivedDeal,
  isClosedDeal,
  isPendingDeal
} from 'deals/List/helpers/statuses'

const Filters = {
  all: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return !isArchivedDeal(deal, statuses) && !isClosedDeal(deal, statuses)
  },
  drafts: (deal: IDeal) => {
    return deal.is_draft === true
  },
  actives: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isActiveDeal(deal, statuses)
  },
  pendings: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isPendingDeal(deal, statuses)
  },
  archives: (deal: IDeal, statuses: IDealStatus[] = []) => {
    return isArchivedDeal(deal, statuses) || isClosedDeal(deal, statuses)
  }
}

export function useDealsList() {
  const user = useSelector(selectUser)
  const deals = useSelector(({ deals }: IAppState) => deals.list)
  const [statuses] = useBrandStatuses(getActiveTeamId(user)!)

  return useCallback(
    (activeFilter: string = 'all') => {
      if (!deals) {
        return []
      }

      const filterFn =
        activeFilter && Filters[activeFilter]
          ? Filters[activeFilter]
          : Filters.all

      return Object.values(deals).filter(deal =>
        filterFn(deal, statuses)
      ) as IDeal[]
    },
    [deals, statuses]
  )
}
