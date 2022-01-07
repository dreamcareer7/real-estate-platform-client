import { IFormattedCompactListing } from '../../../types'

export const setListings = (
  listings: IFormattedCompactListing[],
  info: ICompactListingInfo
) => ({
  type: 'SET_LISTINGS' as 'SET_LISTINGS',
  payload: {
    listings,
    info
  }
})

export const toggleListingFavoriteState = (id: UUID) => ({
  type: 'TOGGLE_LISTING_FAVORITE_STATE' as 'TOGGLE_LISTING_FAVORITE_STATE',
  payload: {
    id
  }
})

export const setMapLocation = (center: ICoord, zoom: number) => ({
  type: 'SET_MAP_LOCATION' as 'SET_MAP_LOCATION',
  payload: {
    center,
    zoom
  }
})

export const setIsLoading = (isLoading: boolean) => ({
  type: 'SET_IS_LOADING' as 'SET_IS_LOADING',
  payload: {
    isLoading
  }
})

export type Actions = ReturnType<
  | typeof setListings
  | typeof toggleListingFavoriteState
  | typeof setMapLocation
  | typeof setIsLoading
>