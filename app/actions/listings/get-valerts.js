// actions/listings/get-similars.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, options) => {
  const params = {
    options,
    access_token: user.access_token
  }

  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success')
      AppStore.data.listing_map.listings = response.data
    delete AppStore.data.listing_map.is_loading
    AppStore.emitChange()
  })
}