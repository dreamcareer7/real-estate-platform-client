import * as types from '../../../constants/listings/map'
import { isAutoMove } from '../../../reducers/listings/map'
import { getFetchingStatus } from '../../../reducers/listings'

export const setOffMapAutoMove = () => ({
  tabName: 'SEARCH',
  type: types.SET_OFF_MAP_AUTO_MOVE
})

export const setOnMapAutoMove = () => ({
  tabName: 'SEARCH',
  type: types.SET_ON_MAP_AUTO_MOVE
})

export const setMapProps = (tabName, mapProps) => ({
  tabName,
  mapProps,
  type: types.SET_MAP_PROPS
})

export const updateMapZoom = (tabName, zoomType) => ({
  tabName,
  type: `${types.SET_MAP_ZOOM}_${zoomType}`
})

export const setMapHoveredMarkerId = (tabName, id) => ({
  id,
  tabName,
  type: types.SET_MAP_HOVERED_MARKER_ID
})

export const goToPlace = mapProps => (dispatch, getState) => {
  const { listings, map } = getState().search

  if (getFetchingStatus(listings) || isAutoMove(map)) {
    return Promise.resolve()
  }

  dispatch(setOnMapAutoMove())
  dispatch(setMapProps('SEARCH', mapProps))
}
