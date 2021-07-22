import { useEffect } from 'react'

import { browserHistory } from 'react-router'

export function useDefaultTab(
  params: Record<string, unknown>,
  defaultTab: Nullable<string>
) {
  useEffect(() => {
    if (params.hasOwnProperty('filter') && !params.filter && defaultTab) {
      browserHistory.push(`/dashboard/deals/filter/${defaultTab}`)
    }
  }, [defaultTab, params])
}
