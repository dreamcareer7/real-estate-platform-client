import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import { getDealChecklists } from 'reducers/deals/checklists'

export function useDealStatuses(deal: IDeal | null) {
  const checklists = useSelector<IAppState, IDealChecklist[]>(state =>
    getDealChecklists(deal, state.deals.checklists)
  )

  return checklists.flatMap(({ origin }) => {
    const brandChecklist = deal?.property_type.checklists?.find(
      ({ id }) => id === origin
    )

    if (!brandChecklist) {
      return []
    }

    return brandChecklist?.statuses || []
  })
}
