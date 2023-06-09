import { Component, cloneElement } from 'react'

import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'

import { withRouter } from '@app/routes/with-router'
import ShowingSocket from 'services/socket/showings'
import {
  hasUserAccessToCrm,
  hasUserAccessToDeals,
  hasUserAccessToShowings,
  isBackOffice
} from 'utils/acl'

import { isLoadedContactAttrDefs } from '../../../reducers/contacts/attributeDefs'
import { selectListings } from '../../../reducers/listings'
import ChatSocket from '../../../services/socket/chat'
import ContactSocket from '../../../services/socket/contacts'
import DealSocket from '../../../services/socket/deals'
import NotificationSocket from '../../../services/socket/Notifications'
import { getAttributeDefs } from '../../../store_actions/contacts'
import { deactivateIntercom } from '../../../store_actions/intercom'
import { getAllNotifications } from '../../../store_actions/notifications'
import CheckBrowser from '../../../views/components/CheckBrowser'
import EmailVerificationBanner from '../../../views/components/EmailVerificationBanner'
import Intercom from '../../../views/components/Intercom'
import syncOpenHouseData from '../../helpers/sync-open-house-offline-registers'

import { DashboardLayout } from './DashboardLayout'

class Dashboard extends Component {
  UNSAFE_componentWillMount() {
    const { user } = this.props

    if (user) {
      new ChatSocket(user)
    }
  }

  componentDidMount() {
    this.init()
  }

  componentWillUnmount() {
    const { activeTeam, dispatch } = this.props

    dispatch(deactivateIntercom(true))

    if (activeTeam && hasUserAccessToCrm(activeTeam)) {
      window.removeEventListener('online', this.handleOnlineEvent)
    }
  }

  async init() {
    const { user, activeTeam, deals, dispatch } = this.props

    console.log('init of dashboard', { user, activeTeam, deals })

    if (!activeTeam || !user) {
      return
    }

    const hasBackOfficeAccess = isBackOffice(activeTeam)

    this.hasCrmAccess = hasUserAccessToCrm(activeTeam)
    this.hasDealsAccess =
      hasUserAccessToDeals(activeTeam) || hasBackOfficeAccess
    this.hasShowingsAccess = hasUserAccessToShowings(activeTeam)

    // load CRM attributes definition
    if (
      (this.hasCrmAccess || this.hasDealsAccess) &&
      !isLoadedContactAttrDefs(this.props.contactsAttributeDefs)
    ) {
      dispatch(getAttributeDefs())
    }

    this.initializeSockets(user)

    dispatch(getAllNotifications())

    dispatch(syncOpenHouseData(user.access_token))

    if (this.hasCrmAccess) {
      // fetch the number of unread email threads

      window.addEventListener('online', this.handleOnlineEvent)
    }
  }

  initializeSockets(user) {
    new NotificationSocket(user)

    if (this.hasCrmAccess) {
      new ContactSocket(user)
    }

    if (this.hasDealsAccess) {
      new DealSocket(user)
    }

    if (this.hasShowingsAccess) {
      new ShowingSocket(user)
    }
  }

  handleOnlineEvent = () => {
    // update the number of unread emails in Inbox nav link notification badge
  }

  render() {
    const { data, user, location } = this.props

    // don't remove below codes,
    // because app is depended to `path` and `location` props in data store
    data.path = location.pathname
    data.location = location

    return (
      <CheckBrowser id={this.props.params.id}>
        <Helmet>
          <title>Rechat | Today</title>
        </Helmet>
        <div className="u-scrollbar">
          {user && !user.email_confirmed && !user.fake_email && (
            <EmailVerificationBanner show email={user.email} />
          )}

          <DashboardLayout>
            {cloneElement(this.props.children, {
              data,
              user
            })}
          </DashboardLayout>

          <Intercom />
        </div>
      </CheckBrowser>
    )
  }
}

function mapStateToProps(state) {
  return {
    contactsAttributeDefs: state.contacts.attributeDefs,
    data: state.data,
    deals: state.deals.list,
    isFetchingDeals: state.deals.properties.isFetchingDeals,
    favoritesListings: selectListings(state.favorites.listings),
    rooms: state.chatroom.rooms,
    user: state.user,
    activeTeam: state.activeTeam ?? null
  }
}

export default withRouter(connect(mapStateToProps)(Dashboard))
