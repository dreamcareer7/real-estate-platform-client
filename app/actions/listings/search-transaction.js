// actions/listings/search-transation.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    q: q_commas,
    access_token: user.access_token
  }
  Listing.search(params, (err, response) => {
    // Success
    // New transaction
    if (AppStore.data.new_transaction) {
      if (response.status === 'success')
        AppStore.data.new_transaction.listings_found = response.data
      else
        delete AppStore.data.new_transaction.listings_found
      delete AppStore.data.new_transaction.listing_searching
      AppStore.data.new_transaction.listing_q = q
      AppStore.emitChange()
    }
  })
}