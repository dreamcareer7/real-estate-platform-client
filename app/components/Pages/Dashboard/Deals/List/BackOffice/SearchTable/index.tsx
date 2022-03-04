import { isEqual } from 'lodash'

import { DEALS_LIST_DEFAULT_FILTERS } from '../constants'
import Grid from '../Grid'
import { SearchQuery } from '../types'

import { Filters } from './Filters'
import { UseFiltersWithQuery } from './Filters/useFiltersWithQuery'

interface Props {
  searchQuery: SearchQuery
  statuses: IDealStatus[]
}

function SearchTable({ searchQuery, statuses }: Props) {
  const [userFilters, setUserFilters] = UseFiltersWithQuery()

  const isSearching: boolean =
    searchQuery.term.length > 0 ||
    !isEqual(userFilters, DEALS_LIST_DEFAULT_FILTERS)

  return (
    <>
      <Filters
        searchQuery={searchQuery}
        userFilters={userFilters}
        onFiltersChange={setUserFilters}
      />
      <Grid
        searchQuery={searchQuery}
        statuses={statuses}
        isSearching={isSearching}
      />
    </>
  )
}

export default SearchTable
