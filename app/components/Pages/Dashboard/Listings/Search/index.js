import React from 'react'

import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  CircularProgress
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import MyLocation from '@material-ui/icons/MyLocation'
import memoize from 'lodash/memoize'
import hash from 'object-hash'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { batchActions } from 'redux-batched-actions'

import {
  loadMapLibraries,
  isMapLibrariesLoaded
} from '@app/utils/google-map-api'
import { confirmation } from 'actions/confirmation'
import { setMapProps } from 'actions/listings/map'
import searchActions from 'actions/listings/search'
import { toggleFilterArea } from 'actions/listings/search/filters/toggle-filters-area'
import getListingsByValert from 'actions/listings/search/get-listings/by-valert'
import { setUserSetting } from 'actions/user/set-setting'
import { getUserTeams } from 'actions/user/teams'
import GlobalPageLayout from 'components/GlobalPageLayout'
import { DALLAS_POINTS } from 'constants/listings/dallas-points'
import { getPlace } from 'models/listings/search/get-place'
import { putUserSetting } from 'models/user/put-user-setting'
import { selectListings } from 'reducers/listings'
import { getMapBoundsInCircle } from 'utils/get-coordinates-points'
import {
  getBounds,
  getLocationErrorMessage,
  normalizeListingLocation
} from 'utils/map'

import GridView from '../components/GridView'
import ListView from '../components/ListView'
import MapView from '../components/MapView'
import CreateAlertModal from '../components/modals/CreateAlertModal'
import Tabs from '../components/Tabs'
import {
  addDistanceFromCenterToListing,
  formatListing
} from '../helpers/format-listing'
import {
  parsSortIndex,
  getDefaultSort,
  sortByIndex,
  getUserLastBrowsingLocation,
  SORT_FIELD_SETTING_KEY,
  LAST_BROWSING_LOCATION
} from '../helpers/sort-utils'
import { bootstrapURLKeys, mapInitialState } from '../mapOptions'

import Autocomplete from './components/Autocomplete'
import CreateTourAction from './components/CreateTourAction'
import Map from './components/Map'
import { Header } from './Header'

// Golden ratio
const RADIUS = 1.61803398875 / 2

const styles = theme => ({
  exploreContainer: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    paddingTop: 0,
    paddingBottom: 0
  },
  landingContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  landingSearchBox: {
    width: '80%',
    maxWidth: 600,
    marginTop: theme.spacing(10)
  },
  loadingLocateIcon: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1.5)
  }
})

class Search extends React.Component {
  constructor(props) {
    super(props)

    const { query } = props.location

    this.searchQuery = query.q || ''
    this.brokerageQuery = query.brokerage || ''

    let activeView = query.view

    if (!activeView) {
      activeView = 'map'
    }

    const { index, ascending } = parsSortIndex(getDefaultSort(this.props.user))
    const userLastBrowsingLocation = getUserLastBrowsingLocation(
      this.props.user
    )

    this.state = {
      activeView,
      activeSort: {
        index,
        ascending
      },
      isGettingCurrentPosition: false,
      isMapInitialized: false,
      shareModalIsActive: false,
      userLastBrowsingLocation,
      firstRun:
        !userLastBrowsingLocation ||
        Object.keys(userLastBrowsingLocation).length == 0
    }
  }

  componentDidMount() {
    window.initialize = this.initialize

    const googleMapAPIParams = {
      key: bootstrapURLKeys.key,
      libraries: bootstrapURLKeys.libraries.split(','),
      callback: 'initialize'
    }

    if (isMapLibrariesLoaded(googleMapAPIParams.libraries)) {
      this.initialize()
    } else {
      loadMapLibraries(googleMapAPIParams, 'loadJS-mls-search-map')
    }
  }

  initialize = () => {
    const { firstRun } = this.state

    if (
      firstRun &&
      !this.brokerageQuery &&
      !this.searchQuery &&
      !this.props.isWidget
    ) {
      return
    }

    if (this.props.listings.data.length > 0) {
      return this.state.activeView === 'map' ? this.initMap() : true
    }

    if (this.searchQuery) {
      this._findPlace(decodeURIComponent(this.searchQuery))
    } else if (this.brokerageQuery) {
      this._findBrokerage(this.brokerageQuery)
    } else {
      this.initMap()
    }
  }

  initMap = () => {
    const $loadJs = document.getElementById('loadJS-mls-search-map')

    if ($loadJs) {
      $loadJs.parentElement.removeChild($loadJs)
    }

    this.setState({ isMapInitialized: true })
  }

  initUserLocation = (lat, lng) => {
    this.setState(
      {
        firstRun: false,
        isGettingCurrentPosition: false,
        userLastBrowsingLocation: {
          zoom: 15,
          center: { lat, lng }
        }
      },
      this.initMap
    )
  }

  onClickLocate = () => {
    const { dispatch } = this.props

    if (!window.navigator.geolocation) {
      return dispatch(
        confirmation({
          confirmLabel: 'OK',
          message: 'Your device does not support Geolocation',
          hideCancelButton: true
        })
      )
    }

    this.setState({ isGettingCurrentPosition: true })

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        this.initUserLocation(lat, lng)
      },
      error => {
        console.log(error)
        console.log(getLocationErrorMessage(error))
        this.setState({ isGettingCurrentPosition: false })
        dispatch(
          confirmation({
            confirmLabel: 'OK',
            message: 'Your location is disabled',
            description:
              'Please check your browser’s setting and make sure ' +
              'your location sharing is on.',
            hideCancelButton: true
          })
        )
      },
      { timeout: 10000 }
    )
  }

  fetchDallasListings = () => {
    const { dispatch, filterOptions } = this.props

    dispatch(
      getListingsByValert({
        ...filterOptions,
        points: DALLAS_POINTS,
        limit: 200
      })
    )

    const bounds = new window.google.maps.LatLngBounds()

    filterOptions.points.forEach(({ latitude: lat, longitude: lng }) =>
      bounds.extend({ lat, lng })
    )

    batchActions([
      dispatch(searchActions.setSearchInput('Dallas TX, USA')),
      dispatch(searchActions.setSearchLocation(mapInitialState.center)),
      dispatch(
        setMapProps('search', {
          bounds: getBounds(bounds),
          center: mapInitialState.center,
          zoom: mapInitialState.zoom
        })
      )
    ])
  }

  _findPlace = async address => {
    const { dispatch } = this.props

    const isMapView = this.state.activeView === 'map'

    try {
      dispatch(searchActions.setSearchInput(address))

      if (address.length > 7 && address.match(/^\d+$/)) {
        if (isMapView) {
          this.initMap()
        }

        return dispatch(searchActions.searchByMlsNumber(address))
      }

      if (isMapView) {
        await dispatch(searchActions.getPlace(address))

        return this.initMap()
      }

      const place = await getPlace(address, false)

      let center = place.geometry.location
      const { points, bounds } = getMapBoundsInCircle(center, RADIUS, true)

      batchActions([
        dispatch(
          searchActions.getListings.byValert({
            ...this.props.filterOptions,
            limit: 200,
            points
          })
        ),
        dispatch(searchActions.setSearchLocation(center)),
        dispatch(
          setMapProps('search', {
            bounds: getBounds(bounds),
            center,
            zoom: mapInitialState.zoom
          })
        )
      ])
    } catch (error) {
      console.log(error)
    } finally {
      this.initMap()
    }
  }

  _findBrokerage = brokerage => {
    const { dispatch, filterOptions } = this.props

    try {
      batchActions([
        dispatch(
          searchActions.getListings.byValert({
            ...filterOptions,
            offices: [brokerage],
            limit: 200
          })
        ),
        dispatch(
          setMapProps('search', {
            center: mapInitialState.center,
            zoom: mapInitialState.zoom
          })
        )
      ])
    } catch (error) {
      console.log(error)
    }

    return this.initMap()
  }

  onChangeView = e => {
    const activeView = e.currentTarget.dataset.view

    this.setState(
      state => {
        if (activeView === 'map' && !state.isMapInitialized) {
          return {
            activeView,
            isMapInitialized: true
          }
        }

        return { activeView }
      },
      () => {
        browserHistory.push(`/dashboard/mls?view=${activeView}`)
      }
    )
  }

  shareModalCloseHandler = () => this.setState({ shareModalIsActive: false })

  handleSaveSearch = () => {
    if (this.props.listings.info.total < 400) {
      return this.setState({ shareModalIsActive: true })
    }

    this.props.dispatch(
      confirmation({
        confirmLabel: 'Ok',
        description:
          'Please zoom in or set more filters. You can save max 400 listings.',
        hideCancelButton: true,
        message: 'Too many matches!'
      })
    )
  }

  gridViewActions = () => [
    {
      render: ({ selectedRows, resetSelectedRows }) => {
        const listings = this.props.listings.data.filter(({ id }) =>
          selectedRows.includes(id)
        )

        return (
          <CreateTourAction
            disabled={selectedRows.length === 0}
            listings={listings}
            submitCallback={resetSelectedRows}
            user={this.props.user}
          />
        )
      }
    }
  ]

  formatAndAddDistance = (listing, center, user) =>
    addDistanceFromCenterToListing(
      formatListing(normalizeListingLocation(listing), user),
      center
    )

  onChangeSort = async e => {
    let sort = e.currentTarget.dataset.sort
    const { index, ascending } = parsSortIndex(sort)

    this.setState({
      activeSort: {
        index,
        ascending
      }
    })
    await putUserSetting(SORT_FIELD_SETTING_KEY, sort)
    this.props.dispatch(getUserTeams(this.props.user))
  }

  sortListings = memoize(
    (listings, index, ascending) => {
      const formattedListings = listings.data.map(listing =>
        this.formatAndAddDistance(
          listing,
          this.props.mapCenter,
          this.props.user
        )
      )

      return formattedListings.sort((a, b) =>
        sortByIndex(a, b, index, ascending)
      )
    },
    (...args) => `${hash(args[0])}_${args[1]}_${args[2]}`
  )

  updateUserLocation = gmap => {
    // Anonymous user's can also see /mls and explore the map
    // So updatingLastBrowsing location should not be run for them
    if (this.props.user) {
      this.props.dispatch(setUserSetting(LAST_BROWSING_LOCATION, gmap))
    }
  }

  renderMain() {
    const sortedListings = this.sortListings(
      this.props.listings,
      this.state.activeSort.index,
      this.state.activeSort.ascending
    )

    const { isGettingCurrentPosition } = this.state
    const _props = {
      user: this.props.user,
      listings: this.props.listings,
      sortedListings,
      isFetching: this.props.isFetching || isGettingCurrentPosition,
      totalRows: this.props.listings.info.total,
      lastBrowsingLocation: this.state.userLastBrowsingLocation
    }

    switch (this.state.activeView) {
      case 'map':
        return (
          <MapView
            {..._props}
            isWidget={this.props.isWidget}
            tabName="search"
            mapCenter={this.props.mapCenter}
            Map={
              this.state.isMapInitialized && !isGettingCurrentPosition ? (
                <Map
                  {..._props}
                  isWidget={this.props.isWidget}
                  updateUserLocation={this.updateUserLocation}
                />
              ) : null
            }
          />
        )

      case 'grid':
        return <GridView {..._props} />

      default:
        return (
          <ListView
            {..._props}
            plugins={
              _props.user && {
                selectable: {
                  persistent: true,
                  storageKey: 'listings',
                  entityName: 'listings'
                },
                actionable: {
                  actions: this.gridViewActions()
                }
              }
            }
          />
        )
    }
  }

  onClickFilter = () => this.props.dispatch(toggleFilterArea())

  renderExplorePage() {
    const { user, isWidget } = this.props

    return (
      <>
        <Header
          isWidget={this.props.isWidget}
          isFetching={this.props.isFetching}
          activeView={this.state.activeView}
          onChangeView={this.onChangeView}
          hasData={this.props.listings.data.length > 0}
        />
        <Tabs
          user={user}
          onChangeView={this.onChangeView}
          onChangeSort={this.onChangeSort}
          activeView={this.state.activeView}
          isWidget={isWidget}
          activeSort={this.state.activeSort}
          saveSearchHandler={this.handleSaveSearch}
          showSavedSearchButton
        />
        {this.renderMain()}
        <CreateAlertModal
          user={user}
          onHide={this.shareModalCloseHandler}
          isActive={this.state.shareModalIsActive}
          alertProposedTitle={this.props.listings.info.proposed_title}
        />
      </>
    )
  }

  renderLadingPage() {
    const { classes } = this.props

    return (
      <Box className={classes.landingContainer}>
        <Box className={classes.landingSearchBox}>
          <Box my={4}>
            <Typography variant="h4" align="center">
              Where do you want to start?
            </Typography>
          </Box>
          <Box display="flex">
            <Box flexGrow={1}>
              <Autocomplete
                fullWidth
                landingPageSearch
                onSelectPlace={() => {
                  this.searchQuery = window.location.search.substring(3)
                  this.setState({ firstRun: false }, this.initialize)
                }}
              />
            </Box>
            {this.renderLocateButton()}
          </Box>
          <Box mt={1} textAlign="center">
            <img
              src="/static/images/properties/search-landing-bg.jpg"
              width="450"
              alt="Search properties"
            />
          </Box>
        </Box>
      </Box>
    )
  }

  renderLocateButton() {
    return (
      <Tooltip title="Get your exact location on the map">
        {this.state.isGettingCurrentPosition ? (
          <CircularProgress
            className={this.props.classes.loadingLocateIcon}
            size={21}
          />
        ) : (
          <IconButton aria-label="locate me" onClick={this.onClickLocate}>
            <MyLocation />
          </IconButton>
        )}
      </Tooltip>
    )
  }

  render() {
    const { classes, isWidget } = this.props
    const { firstRun } = this.state
    const hasUrlQuery = !!(this.brokerageQuery || this.searchQuery)

    return (
      <GlobalPageLayout className={classes.exploreContainer}>
        {firstRun && !hasUrlQuery && !isWidget
          ? this.renderLadingPage()
          : this.renderExplorePage()}
      </GlobalPageLayout>
    )
  }
}

const mapStateToProps = ({ user, search }) => {
  const { listings } = search

  return {
    user,
    isLoggedIn: user || false,
    filterOptions: search.options,
    isFetching: listings.isFetching,
    filtersIsOpen: search.filters.isOpen,
    mapCenter: search.map.props.center,
    listings: {
      data: selectListings(listings),
      info: listings.info
    }
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps)(Search)
)

// todo: refactor initmap when there is a querystring
