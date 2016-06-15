// actions/listings/get-alert-map.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'

export default (user, room_id, alert_id) => {
  const params = {
    access_token: user.access_token,
    room_id,
    alert_id
  }
  Alert.get(params, (err, res) => {
    const feed = res.data
    AppStore.data.current_alert.info = res.info
    AppStore.data.current_alert.feed = feed
    AppStore.emitChange()
  })
}