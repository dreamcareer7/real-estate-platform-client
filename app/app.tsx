import { useDispatch, useSelector } from 'react-redux'
import { browserHistory, Router } from 'react-router'
import { IntercomProvider } from 'react-use-intercom'
import smoothscroll from 'smoothscroll-polyfill'

import ConfirmationModal from '@app/views/components/ConfirmationModal'
import ConfirmationModalProvider from '@app/views/components/ConfirmationModal/context/Provider'
import { GlobalActionsProvider } from '@app/views/components/GlobalActionsButton/context/provider'
import { ReactQueryProvider } from '@app/views/components/ReactQueryProvider'
import { useAppcues } from 'services/appcues/use-appcues'

import config from '../config/public'

import { AppTheme } from './AppTheme'
// This is our new confirmation modal. use this please.
import { NotificationBadgesContextProvider } from './components/Pages/Dashboard/SideNav/notificationBadgesContext/Provider'
import ReduxConfirmationModal from './components/Partials/Confirmation'
import { Notifications } from './Notifications'
// Routes config
import routes from './routes'
import { selectActiveBrandIdUnsafe } from './selectors/brand'
import { activateIntercom } from './store_actions/intercom'
// This is a redux-based confirmation and will be deprecate asap.
// import styles
import './styles/main.scss'

// smooth scroll polyfill
if (typeof window !== 'undefined') {
  smoothscroll.polyfill()
}

const App = () => {
  const dispatch = useDispatch()
  const brandId = useSelector(selectActiveBrandIdUnsafe)

  useAppcues()

  return (
    <ReactQueryProvider>
      <AppTheme>
        <IntercomProvider
          appId={config.intercom.app_id}
          onShow={() => dispatch(activateIntercom())}
        >
          <NotificationBadgesContextProvider brandId={brandId}>
            <GlobalActionsProvider>
              <ConfirmationModalProvider>
                <Router history={browserHistory}>{routes}</Router>
                <ConfirmationModal />
              </ConfirmationModalProvider>

              <ReduxConfirmationModal />

              <Notifications />
            </GlobalActionsProvider>
          </NotificationBadgesContextProvider>
        </IntercomProvider>
      </AppTheme>
    </ReactQueryProvider>
  )
}

export default App
