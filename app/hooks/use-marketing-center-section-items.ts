import _values from 'lodash/values'

import { SectionItem } from 'components/PageSideNav/types'
import { useMarketingCenterSections } from 'hooks/use-marketing-center-sections'

export function useMarketingCenterSectionItems(): SectionItem[] {
  const allSections = _values(useMarketingCenterSections(null))

  return allSections.reduce((prev, curr) => {
    // We don't need all designs section
    return [...prev, ...curr.items.filter(item => !item.isIndex)]
  }, [])
}
