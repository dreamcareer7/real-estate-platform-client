// Dashboard/Mls/index.js
import React, { Component } from 'react'
import S from 'shorti'
import _ from 'lodash'
import GoogleMap from 'google-map-react'
import { ButtonGroup, Button, Modal } from 'react-bootstrap'
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import controller from '../controller'
import SideBar from '../Partials/SideBar'
import MobileNav from '../Partials/MobileNav'
import ShareAlertModal from './Partials/ShareAlertModal'
import ShareTypeModal from './Partials/ShareTypeModal'
import ListingViewer from '../Partials/ListingViewer'
import ListingViewerMobile from '../Partials/ListingViewerMobile'
import ListingPanel from './Partials/ListingPanel'
import FilterForm from './Partials/FilterForm'
import ListingMarker from '../Partials/ListingMarker'
import AlertList from './Partials/AlertList'
import AlertViewer from './Partials/AlertViewer'
import listing_util from '../../../../utils/listing'
export default class Mls extends Component {
  componentWillMount() {
    const data = this.props.data
    const user = data.user
    if (this.props.params && this.props.params.id) {
      ListingDispatcher.dispatch({
        action: 'get-listing',
        user,
        id: this.props.params.id
      })
    }
    // Show map first
    AppStore.data.show_search_map = true
    AppStore.data.user = user
    AppStore.emitChange()
    const listing_map = data.listing_map
    if (!listing_map && typeof window !== 'undefined')
      controller.listing_map.initMap()
    delete AppStore.data.current_listing
    delete AppStore.data.share_list
    delete AppStore.data.listing_map.saving_alert
    // Set switch states
    if (!AppStore.data.listing_map.filter_options) {
      AppStore.data.listing_map.filter_options = {
        sold: false,
        active: true,
        other: false,
        open_houses: false,
        listing_types: ['any'],
        status_options: {
          active: ['Active', 'Active Contingent', 'Active Kick Out', 'Active Option Contract']
        },
        minimum_bedrooms: 0,
        minimum_bathrooms: 1,
        pool: 'either'
      }
    }
    AppStore.emitChange()
    // Get only map (above) for non-logged in user
    if (!user && AppStore.data.listing_map) {
      ListingDispatcher.dispatch({
        action: 'get-valerts',
        user,
        options: AppStore.data.listing_map.options
      })
      return
    }
    // Allow for seamless
    if (!AppStore.data.mounted || AppStore.data.mounted && AppStore.data.mounted.indexOf('recents') === -1) {
      if (!AppStore.data.mounted)
        AppStore.data.mounted = []
      AppStore.data.mounted.push('recents')
      this.getRoomsIndexedDB()
      this.getUserRooms()
    }
    AppDispatcher.dispatch({
      action: 'get-contacts',
      user
    })
    if (this.props.location && this.props.location.query.message && this.props.location.query.message === 'welcome') {
      AppStore.data.show_welcome_modal = true
      AppStore.emitChange()
    }
    // Get alerts
    if (!data.alerts) {
      ListingDispatcher.dispatch({
        action: 'get-alerts',
        user
      })
    }
    // Get favorites
    if (!user.favorite_listings) {
      ListingDispatcher.dispatch({
        action: 'get-favorites',
        user
      })
    }
    // Get actives
    if (!data.active_listings) {
      ListingDispatcher.dispatch({
        action: 'get-actives',
        user
      })
    }
  }
  componentDidMount() {
    this.resetViews()
    this.routeURL()
    this.checkForMobile()
  }
  componentDidUpdate() {
    const data = this.props.data
    const routeParams = this.props.routeParams
    let alert_id
    if (routeParams)
      alert_id = routeParams.alert_id
    const path = data.path
    if (data.show_listing_viewer && path === '/dashboard/mls') {
      delete AppStore.data.show_listing_viewer
      delete AppStore.data.current_listing
      AppStore.emitChange()
    }
    if (!alert_id || !data.alerts || data.current_alert)
      return
    const alert = _.find(data.alerts, { id: alert_id })
    if (alert && window.map) {
      AppStore.data.current_alert = alert
      AppStore.emitChange()
      controller.alert_map.showAlertOnMap(alert)
    }
  }
  componentWillUnmount() {
    controller.listing_map.hideModal()
  }
  routeURL() {
    const data = this.props.data
    const path = data.path
    if (path === '/dashboard/mls')
      AppStore.data.show_search_map = true
    if (path === '/dashboard/mls/actives')
      AppStore.data.show_actives_map = true
    if (path.indexOf('/dashboard/mls/alerts') !== -1)
      AppStore.data.show_alerts_map = true
    AppStore.emitChange()
  }
  checkForMobile() {
    AppDispatcher.dispatch({
      action: 'check-for-mobile'
    })
  }
  getRoomsIndexedDB() {
    const data = this.props.data
    const user = data.user
    AppDispatcher.dispatch({
      action: 'get-rooms-indexeddb',
      user_id: user.id
    })
  }
  getUserRooms() {
    const data = this.props.data
    const user = data.user
    const room_id = this.props.params.room_id
    AppDispatcher.dispatch({
      action: 'get-rooms',
      user,
      room_id
    })
  }
  hideWelcomeModal() {
    delete AppStore.data.show_welcome_modal
    AppStore.emitChange()
  }
  changeURL(url) {
    this.props.history.pushState(null, url)
  }
  resetViews() {
    delete AppStore.data.show_search_map
    delete AppStore.data.show_alerts_map
    delete AppStore.data.show_actives_map
    AppStore.emitChange()
  }
  handleTabClick(type) {
    if (window.poly) {
      window.poly.setMap(null)
      delete window.poly
    }
    this.resetViews()
    switch (type) {
      case 'search':
        AppStore.data.show_search_map = true
        delete AppStore.data.listing_map.auto_move
        controller.listing_filter.setFilterOptions.bind(this)
        if (window.poly_search) {
          window.poly = window.poly_search
          const google = window.google
          const map = window.map
          const path = window.poly.getPath()
          window.poly = new google.maps.Polygon({
            clickable: false,
            map,
            path,
            strokeColor: '#3388ff',
            strokeWeight: 10
          })
        }
        this.changeURL('/dashboard/mls')
        break
      case 'alerts':
        AppStore.data.show_alerts_map = true
        delete AppStore.data.listing_map.auto_move
        delete AppStore.data.show_filter_form
        AppStore.data.show_alerts_map = true
        if (window.poly_alerts) {
          window.poly = window.poly_alerts
          const google = window.google
          const map = window.map
          const path = window.poly.getPath()
          window.poly = new google.maps.Polygon({
            clickable: false,
            map,
            path,
            strokeColor: '#3388ff',
            strokeWeight: 10
          })
        }
        this.changeURL('/dashboard/mls/alerts')
        break
      case 'actives':
        AppStore.data.show_actives_map = true
        this.changeURL('/dashboard/mls/actives')
        break
      default:
        return
    }
    AppStore.emitChange()
  }
  handleClearSearchInputClick() {
    const data = this.props.data
    delete AppStore.data.listing_map.search_input_text
    delete AppStore.data.listing_map.auto_move
    delete AppStore.data.listing_map.has_search_input
    delete AppStore.data.listing_map.no_listings_found
    AppStore.emitChange()
    let bounds = window.map.getBounds().toJSON()
    bounds = [
      bounds.south,
      bounds.west,
      bounds.north,
      bounds.east
    ]
    controller.listing_map.handleBoundsChange(data.listing_map.center, data.listing_map.zoom, bounds)
  }
  render() {
    const data = this.props.data
    const user = data.user
    const listing_map = data.listing_map
    const alerts_map = data.alerts_map
    let main_style = S('absolute h-100p' + (user ? ' l-70' : ' l-0'))
    if (data.is_mobile) {
      main_style = {
        ...main_style,
        ...S('l-0 w-100p')
      }
    }
    let loading
    if (listing_map && listing_map.is_loading) {
      let loading_style = S('z-1 center-block absolute h-0 w-100p t-80 z-2')
      if (data.is_mobile) {
        loading_style = {
          ...loading_style,
          ...S('fixed t-60')
        }
      }
      loading = (
        <div style={ loading_style }>
          <div style={ S('bg-3388ff br-20 color-fff w-190 h-29 pt-5 center-block text-center') }>Loading MLS&reg; Listings...</div>
        </div>
      )
    }
    let listing_viewer
    if (data.show_listing_viewer) {
      listing_viewer = (
        <ListingViewer
          data={ data }
          listing={ data.current_listing }
          hideModal={ controller.listing_map.hideModal }
          hideListingViewer={ controller.listing_viewer.hideListingViewer.bind(this) }
          showModalGallery={ controller.listing_viewer.showModalGallery }
          handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
          showShareListingModal={ controller.listing_viewer.showShareListingModal }
        />
      )
      // Check for mobile
      if (data.is_mobile) {
        listing_viewer = (
          <ListingViewerMobile
            data={ data }
            listing={ data.current_listing }
            hideModal={ controller.listing_map.hideModal }
            hideListingViewer={ controller.listing_viewer.hideListingViewer }
            showModalGallery={ controller.listing_viewer.showModalGallery }
            handleModalGalleryNav={ controller.listing_viewer.handleModalGalleryNav }
            showShareListingModal={ controller.listing_viewer.showShareListingModal }
          />
        )
      }
    }

    let main_class = 'listing-map'
    if (data.show_listing_panel)
      main_class = main_class + ' active'
    const default_center = {
      lat: 32.7767,
      lng: -96.7970
    }
    const default_zoom = 13
    const toolbar_style = {
      ...S('h-66 p-10 bg-f8fafb'),
      borderBottom: '1px solid #dcd9d9'
    }
    // TODO move to ENV_VAR
    const bootstrap_url_keys = {
      key: 'AIzaSyDagxNRLRIOsF8wxmuh1J3ysqnwdDB93-4',
      libraries: ['drawing'].join(',')
    }
    let map_id
    if (listing_map && listing_map.map_id)
      map_id = listing_map.map_id
    let remove_drawing_button
    if (data.show_search_map && window.poly && window.poly_search) {
      let right_value = 80
      if (data.listing_panel)
        right_value = 910
      remove_drawing_button = (
        <Button
          onClick={ controller.listing_map.removeDrawing.bind(this) }
          bsStyle="danger"
          className="transition"
          style={ S('absolute z-10 t-160 br-100 w-50 h-50 color-fff pt-1 font-30 text-center r-' + right_value) }
        >
          &times;
        </Button>
      )
    }
    let zoom_right = 'r-20'
    if (data.show_listing_panel)
      zoom_right = 'r-860'
    let zoom_bottom = ' b-25'
    if (data.is_mobile)
      zoom_bottom = ' b-75'
    const zoom_controls = (
      <ButtonGroup className="transition" vertical style={ S('fixed ' + zoom_right + zoom_bottom) }>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'in') }><i style={ S('color-929292') } className="fa fa-plus"></i></Button>
        <Button bsSize="large" onClick={ controller.listing_map.handleZoomClick.bind(this, 'out') }><i style={ S('color-929292') } className="fa fa-minus"></i></Button>
      </ButtonGroup>
    )
    let results_actions
    let create_alert_button
    if (data.show_search_map) {
      create_alert_button = (
        <Button style={ S('absolute r-20 t-70 z-1 bg-2196f3 w-200 h-50 font-18') } bsStyle="primary" type="button" onClick={ controller.alert_share.showShareTypeModal.bind(this) }>
          { (user && user.user_type === 'Agent') ? 'Create Alert' : 'Save Search' }
        </Button>
      )
    }
    if (listing_map && listing_map.listings) {
      results_actions = (
        <div style={ S('absolute r-5 mt-2 t-15') }>
          { create_alert_button }
          <ButtonGroup style={ S('mr-10') }>
            <Button style={ { ...S('bg-f8fafb h-37'), outline: 'none' } } onClick={ controller.listing_panel.hideListingPanel.bind(this) }>
              <img src={ `/images/dashboard/mls/globe${!data.listing_panel ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button style={ { ...S('bg-f8fafb h-37'), outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'list') }>
              <img src={ `/images/dashboard/mls/list${data.listing_panel && data.listing_panel.view === 'list' ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button style={ { ...S('bg-f8fafb h-37'), outline: 'none' } } onClick={ controller.listing_panel.showPanelView.bind(this, 'photos') }>
              <img src={ `/images/dashboard/mls/photos${data.listing_panel && data.listing_panel.view === 'photos' ? '-active' : ''}.svg` } style={ S('w-18') }/>
            </Button>
          </ButtonGroup>
        </div>
      )
    }
    let search_input_text
    if (data.listing_map && data.listing_map.search_input_text)
      search_input_text = data.listing_map.search_input_text
    const search_input_style = {
      ...S('font-18 bg-fff w-400 h-50 pull-left'),
      border: 'none'
    }
    let search_area = (
      <form onSubmit={ controller.listing_map.handleSearchSubmit.bind(this) }>
        <input onChange={ controller.listing_map.handleSearchInputChange.bind(this) } value={ search_input_text } ref="search_input" className="form-control" type="text" style={ search_input_style } placeholder="Search location or MLS#" />
      </form>
    )
    if (data.current_listing)
      search_area = ''
    let nav_area = (
      <SideBar data={ data }/>
    )
    if (data.is_mobile && user) {
      nav_area = (
        <MobileNav data={ data }/>
      )
    }
    const draw_button_style = {
      ...S('mr-10 bg-fff h-52 w-50 br-5'),
      outline: 'none',
      border: 'solid 1px #d7d6d6',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
    }
    const search_area_style = {
      ...S('pull-left mr-10 bg-fff border-1-solid-d7d6d6 br-5'),
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.1)'
    }
    let clear_search_input
    if (data.listing_map && data.listing_map.search_input_text) {
      clear_search_input = (
        <div onClick={ this.handleClearSearchInputClick.bind(this) } className="close" style={ S('absolute l-340 t-15') }>&times;</div>
      )
    }
    let options_text
    if (listing_map)
      options_text = (listing_map.listings ? (listing_map.listings.length + ' showing of ' + listing_map.listings_info.total) : '') + ' homes. ' + listing_util.alertOptionsShort(listing_map.options)
    if (listing_map && data.listing_map.search_input_text && listing_map.no_listings_found)
      options_text = 'No listings found'
    const options_gist = (
      <div style={ S('relative mt-10 w-504') }>
        <div style={ S('z-0 op-.4 bg-000 absolute w-504 h-40 br-3') }></div>
        <div style={ S('z-1 color-fff p-10 relative w-504') }>{ options_text }</div>
      </div>
    )
    let search_filter_draw_area = (
      <div style={ S('relative t-35 l-10 z-1 w-580') }>
        <div style={ search_area_style }>
          <div style={ S('pull-left mr-10 relative') }>
            { search_area }
            { clear_search_input }
            <img onClick={ controller.listing_map.handleSearchSubmit.bind(this) } style={ S('absolute r-15 t-15 w-20 pointer') } src="/images/dashboard/mls/search.svg" />
            <div style={ S('w-1 h-28 absolute l-400 t-13 bg-dddddd') }></div>
          </div>
          <div style={ S('pull-left') }>
            <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { ...S('h-50 border-1-solid-fff'), outline: 'none' } }>
              <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
              <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
            </Button>
          </div>
        </div>
        <div style={ S('pull-left') }>
          <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ draw_button_style }>
            <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
          </Button>
        </div>
        <div className="clearfix"></div>
        { options_gist }
      </div>
    )
    // Hide search form
    if (data.show_filter_form || data.show_alerts_map || data.show_actives_map)
      search_filter_draw_area = ''
    const underline = <div style={ S('w-100p h-6 bg-3388ff absolute b-11n') }></div>
    const map_tabs = (
      <ul style={ S('relative l-30n t-5') }>
        <li style={ S('relative pull-left font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'search') } style={ S('pointer ' + (data.show_search_map ? 'color-263445' : 'color-8696a4')) }>Search</span>
          { data.show_search_map && !data.show_alerts_map ? underline : '' }
        </li>
        <li style={ S('relative pull-left color-263445 font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'alerts') } style={ S('pointer ' + (data.show_alerts_map ? 'color-263445' : 'color-8696a4')) }>{ user && user.user_type === 'Agent' ? 'Alerts' : 'Saved Searches' }</span>
          { data.show_alerts_map ? underline : '' }
        </li>
        <li style={ S('relative pull-left color-263445 font-28 mr-60') }>
          <span onClick={ this.handleTabClick.bind(this, 'actives') } style={ S('pointer ' + (data.show_actives_map ? 'color-263445' : 'color-8696a4')) }>{ user && user.user_type === 'Agent' ? 'Activity' : 'My Homes' }</span>
          { data.show_actives_map ? underline : '' }
        </li>
      </ul>
    )
    let toolbar = (
      <nav style={ toolbar_style }>
        <div style={ S('h-35') }>{ user ? map_tabs : '' }</div>
        <div className="clearfix"></div>
        { search_filter_draw_area }
        { results_actions }
      </nav>
    )
    if (data.is_mobile) {
      search_area = (
        <form onSubmit={ controller.listing_map.handleSearchSubmit.bind(this) }>
          <img onClick={ controller.listing_map.handleSearchSubmit.bind(this) } src="/images/dashboard/mls/search.svg" style={ S('pointer w-22 h-22 absolute l-13 t-14') } />
          <input onChange={ controller.listing_map.handleSearchInputChange.bind(this) } value={ search_input_text } ref="search_input" className="form-control" type="text" style={ S('font-18 bg-dfe3e8 w-200 pull-left pl-40') } placeholder="Location or MLS#" />
        </form>
      )
      toolbar = (
        <nav style={ S('border-bottom-1-solid-ccc p-5 fixed t-0 w-100p z-10 bg-fff') }>
          <div style={ S('w-150 pull-left') }>
            { search_area }
          </div>
          <div style={ S('pull-right') }>
            <Button onClick={ controller.listing_map.toggleDrawable.bind(this) } style={ { ...S('mr-10'), outline: 'none' } }>
              <img src={ `/images/dashboard/mls/draw${data.listing_map && data.listing_map.drawable ? '-active' : ''}.svg` } style={ S('w-20') }/>
            </Button>
            <Button onClick={ controller.listing_filter.showFilterForm.bind(this, 'photos') } style={ { outline: 'none' } }>
              <img src={ `/images/dashboard/mls/filters${data.show_filter_form ? '-active' : ''}.svg` } style={ S('w-20 mr-10') }/>
              <span className={ data.show_filter_form ? 'text-primary' : '' }>Filters</span>
            </Button>
          </div>
          <div className="clearfix"></div>
          { create_alert_button }
        </nav>
      )
    }
    // Create markers
    let map_listing_markers
    if (data.show_search_map && listing_map && listing_map.listings) {
      let listings = listing_map.listings
      listings = listings.filter(listing => {
        return listing.location
      })
      map_listing_markers = listings.map(listing => {
        return (
          <div onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) } onMouseOut={ controller.listing_map.hideListingPopup.bind(this) } key={ 'search-map--map-listing-' + listing.id } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.compact_property }
              address={ listing.address }
              context={ 'map' }
            />
          </div>
        )
      })
    }
    let map_alerts_markers
    if (data.show_alerts_map && alerts_map && alerts_map.listings) {
      let listings = alerts_map.listings
      listings = listings.filter(listing => {
        return listing.location
      })
      map_alerts_markers = listings.map(listing => {
        return (
          <div onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) } onMouseOut={ controller.listing_map.hideListingPopup.bind(this) } key={ 'alert-map--map-listing-' + listing.id } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.location.latitude } lng={ listing.location.longitude } text={'A'}>
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.compact_property }
              address={ listing.address }
              context={ 'map' }
            />
          </div>
        )
      })
    }
    let map_actives_markers
    if (data.show_actives_map && data.active_listings) {
      let listings = data.active_listings
      listings = listings.filter(listing => {
        if (listing.property && listing.property.address)
          return listing.property.address.location
      })
      map_actives_markers = listings.map((listing, i) => {
        return (
          <div onMouseOver={ controller.listing_map.showListingPopup.bind(this, listing) } onMouseOut={ controller.listing_map.hideListingPopup.bind(this) } key={ 'actives-map--map-listing-' + listing.id + '-' + i } onClick={ controller.listing_viewer.showListingViewer.bind(this, listing) } style={ S('pointer mt-10') } lat={ listing.property.address.location.latitude } lng={ listing.property.address.location.longitude } text={'A'}>
            <ListingMarker
              key={ 'listing-marker-' + listing.id }
              data={ data }
              listing={ listing }
              property={ listing.property }
              address={ listing.property.address }
              context={ 'map' }
            />
          </div>
        )
      })
    }
    // Show listings map
    let map_wrapper_style = S('h-' + (window.innerHeight - 66))
    if (data.is_mobile)
      map_wrapper_style = S('fixed w-100p h-100p')
    let content_area
    if (data.show_search_map) {
      content_area = (
        <GoogleMap
          key={ 'map-' + map_id }
          bootstrapURLKeys={ bootstrap_url_keys }
          center={ listing_map ? listing_map.center : default_center }
          zoom={ listing_map ? listing_map.zoom : default_zoom }
          onBoundsChange={ controller.listing_map.handleBoundsChange.bind(this) }
          options={ controller.listing_map.createMapOptions.bind(this) }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ controller.listing_map.handleGoogleMapApi.bind(this) }
        >
        { map_listing_markers }
        </GoogleMap>
      )
    }
    // Show alerts map
    if (data.show_alerts_map) {
      map_wrapper_style = {
        ...map_wrapper_style,
        ...S('pl-350')
      }
      content_area = (
        <GoogleMap
          key={ 'map-' + map_id }
          bootstrapURLKeys={ bootstrap_url_keys }
          center={ listing_map ? listing_map.center : default_center }
          zoom={ listing_map ? listing_map.zoom : default_zoom }
          onBoundsChange={ controller.listing_map.handleBoundsChange.bind(this) }
          options={ controller.listing_map.createMapOptions.bind(this) }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ controller.listing_map.handleGoogleMapApi.bind(this) }
        >
        { map_alerts_markers }
        </GoogleMap>
      )
    }
    // Show actives map
    if (data.show_actives_map) {
      content_area = (
        <GoogleMap
          key={ 'map-' + map_id }
          bootstrapURLKeys={ bootstrap_url_keys }
          center={ listing_map ? listing_map.center : default_center }
          zoom={ listing_map ? listing_map.zoom : default_zoom }
          onBoundsChange={ controller.listing_map.handleBoundsChange.bind(this) }
          options={ controller.listing_map.createMapOptions.bind(this) }
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={ controller.listing_map.handleGoogleMapApi.bind(this) }
        >
        { map_actives_markers }
        </GoogleMap>
      )
    }
    let alert_list_area
    let alert_viewer_area
    if (data.show_alerts_map) {
      const alert_header_style = {
        ...S('h-42 absolute t-66 w-' + (window.innerWidth - 420))
      }
      const alert_header_bg = {
        ...alert_header_style,
        ...S('bg-000 t-0 z-0'),
        opacity: '.5'
      }
      let alert_header_area
      if (data.show_alerts_map && data.current_alert) {
        const current_alert = data.current_alert
        const alert_options_short = listing_util.alertOptionsShort(current_alert)
        let new_listings_link = 'Loading...'
        if (current_alert.feed)
          new_listings_link = current_alert.feed.length ? `View new listings (${current_alert.feed.length})` : 'No new listings'
        alert_header_area = (
          <div style={ alert_header_style }>
            <div style={ alert_header_bg }></div>
            <div style={ S('relative ml-15 mt-10 color-fff z-1 font-15') }>
              { alert_options_short }
              <div style={ S('pull-right pointer') } onClick={ controller.alert_map.showAlertViewer.bind(this) }>
                <span style={ S('color-98caf1 mr-15') }>{ new_listings_link }</span>
                <span className={ !current_alert.feed || (current_alert.feed && !current_alert.feed.length) ? 'hidden' : '' } style={ S('mr-15 relative t-2') }><i style={ S('color-98caf1') } className="fa fa-chevron-right"></i></span>
              </div>
            </div>
          </div>
        )
      }
      alert_list_area = (
        <div>
          <AlertList data={ data } />
          { alert_header_area }
        </div>
      )
      if (data.show_alert_viewer) {
        alert_viewer_area = (
          <AlertViewer
            data={ data }
          />
        )
      }
    }
    const share_type_modal_area = (
      <ShareTypeModal
        data={ data }
      />
    )
    const main_content = (
      <main>
        { user ? nav_area : '' }
        <div className={ main_class } style={ main_style }>
          { /* this.cacheImages() */ }
          { toolbar }
          { loading }
          <div style={ map_wrapper_style }>
            { remove_drawing_button }
            { content_area }
            { alert_list_area }
            { alert_viewer_area }
          </div>
        </div>
        { listing_viewer }
        <ListingPanel
          data={ data }
          toggleListingPanel={ controller.listing_panel.toggleListingPanel }
          showListingViewer={ controller.listing_viewer.showListingViewer }
          sortListings={ controller.listing_panel.sortListings }
          setActiveListing={ controller.listing_map.setActiveListing }
          removeActiveListing={ controller.listing_map.removeActiveListing }
        />
        <FilterForm
          data={ data }
          handleFilterSwitch={ controller.listing_filter.handleFilterSwitch }
          handleFilterButton={ controller.listing_filter.handleFilterButton }
          resetFilterOptions={ controller.listing_filter.resetFilterOptions }
          setFilterOptions={ controller.listing_filter.setFilterOptions }
          handleOptionChange={ controller.listing_filter.handleOptionChange }
          toggleListingStatusDropdown={ controller.listing_filter.toggleListingStatusDropdown }
          handleFilterStatusOptionSelect={ controller.listing_filter.handleFilterStatusOptionSelect }
          showSoldDatePicker={ controller.listing_filter.showSoldDatePicker }
          handleSetSoldDate={ controller.listing_filter.handleSetSoldDate }
          hideFilterForm={ controller.listing_filter.hideFilterForm }
        />
        { zoom_controls }
        { listing_map && listing_map.show_share_type_modal ? share_type_modal_area : '' }
        <ShareAlertModal
          data={ data }
          shareAlert={ controller.alert_share.shareAlert }
          handleFilterChange={ controller.share_modal.handleFilterChange }
          handleEmailChange={ controller.share_modal.handleEmailChange }
          handlePhoneNumberChange={ controller.share_modal.handlePhoneNumberChange }
          handleAddEmail={ controller.share_modal.handleAddEmail }
          handleAddPhoneNumber={ controller.share_modal.handleAddPhoneNumber }
          handleRemoveShareItem={ controller.share_modal.handleRemoveShareItem }
        />
        <Modal dialogClassName="modal-alert-saved" show={ data.show_alert_saved_modal } onHide={ controller.listing_map.hideModal }>
          <div className="din" style={ S('text-center font-60 color-fff') }>
            <div style={ S('bg-2196f3 w-165 h-165 br-100 center-block pt-35') }>
              <img style={ S('h-70 ml-13') } src="/images/dashboard/mls/alert-bell-saved.svg" />
            </div>
            <span style={ { textShadow: '0 2px 6px rgba(0, 0, 0, 0.2)' } }>Alert Saved</span>
          </div>
        </Modal>
      </main>
    )
    return (
      <div style={ S('minw-1000') }>
        { main_content }
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_welcome_modal } onHide={ this.hideWelcomeModal }>
          <Modal.Body style={ S('text-center p-50') }>
            <div style={ S('font-42') }>Welcome to Rechat!</div>
            <div style={ S('font-22 color-9b9b9b') }>The Real Estate app that Elevates Your Game</div>
            <div style={ S('mt-20 mb-20 h-156') }>
              <img style={ S('w-100p') } src="/images/signup/value-faces.png" />
            </div>
            <Button bsStyle="primary" style={ S('w-100p') } onClick={ this.hideWelcomeModal }>Start Using Rechat</Button>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}
Mls.propTypes = {
  data: React.PropTypes.object,
  params: React.PropTypes.object,
  location: React.PropTypes.object,
  routeParams: React.PropTypes.object,
  history: React.PropTypes.object
}