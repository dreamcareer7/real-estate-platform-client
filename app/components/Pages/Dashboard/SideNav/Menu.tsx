import { useState, ChangeEvent, useEffect, useRef } from 'react'

import { Divider, makeStyles, Accordion } from '@material-ui/core'
import {
  mdiViewGridOutline,
  mdiAccountSupervisorOutline,
  mdiChartArc,
  mdiAlarmLightOutline,
  mdiHelpCircleOutline,
  mdiPhoneOutline,
  mdiMenuUp,
  mdiMenuDown,
  mdiGoogleMaps
} from '@mdi/js'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory, withRouter, WithRouterProps } from 'react-router'
import { ThunkDispatch } from 'redux-thunk'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import { fetchUnreadEmailThreadsCount } from 'actions/inbox'
import { GlobalActionsButton } from 'components/GlobalActionsButton'
import { MenuAccordionDetails as AccordionDetails } from 'components/MenuAccordionDetails'
import { MenuAccordionSummary as AccordionSummary } from 'components/MenuAccordionSummary'
import { MenuBadge } from 'components/MenuBadge'
import { ACL } from 'constants/acl'
import { useChatRoomsNotificationsNumber } from 'hooks/use-chat-rooms-notifications-number'
import { useDealsNotificationsNumber } from 'hooks/use-deals-notifications-number'
import { IAppState } from 'reducers'
import { selectUnreadEmailThreadsCount } from 'reducers/inbox'
import { InboxAction } from 'reducers/inbox/types'
import { selectNotificationNewCount } from 'reducers/notifications'
import { selectShowingsTotalNotificationCount } from 'selectors/showings'
import { selectUserUnsafe } from 'selectors/user'
import { getBrandHelpCenterURL } from 'utils/brand'
import Acl from 'views/components/Acl'
import { ScrollableArea } from 'views/components/ScrollableArea'

import useEmailThreadEvents from '../Inbox/helpers/use-email-thread-events'

import Logo from './components/Logo'
import MessagesDrawerTrigger from './components/MessagesDrawerTrigger'
import PoweredBy from './components/PoweredBy'
import SideNavLinkItem from './components/SideNavLinkItem'
import SideNavLinkSummary from './components/SideNavLinkSummary'
import SupportTrigger from './components/SupportTrigger'
import { UserMenu } from './components/UserMenu'
import {
  Sidenav,
  SidenavBlankLink,
  SideNavItem,
  SideNavItemLabel,
  SidenavListGroup,
  AccordionSummaryDiv,
  AccordionSummaryDot,
  AccordionSummaryLabel
} from './styled'
import { ExpandedMenu, scrollableAreaShadowColor } from './variables'

const useStyles = makeStyles(
  theme => ({
    divider: {
      backgroundColor: theme.palette.grey[800],
      margin: theme.spacing(0.75, 1)
    },
    accordionRoot: {
      backgroundColor: 'transparent'
    },
    accordionExpanded: {
      margin: '0 !important'
    }
  }),
  {
    name: 'SideNavMenu'
  }
)

const openHouseAccess = [ACL.CRM, ACL.MARKETING]
const dealsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE] }
const insightAccess = { oneOf: [ACL.MARKETING, ACL.CRM] }
const dashboardAccess = { oneOf: [ACL.CRM, ACL.DEALS] }
const listingsAccess = { oneOf: [ACL.DEALS, ACL.BACK_OFFICE, ACL.MARKETING] }

function Menu(props: WithRouterProps) {
  const classes = useStyles()
  const {
    location: { pathname }
  } = props
  const user = useSelector(selectUserUnsafe)
  const brand = useSelector<IAppState, IBrand>(
    (state: IAppState) => state.brand
  )
  const appNotifications = useSelector((state: IAppState) =>
    selectNotificationNewCount(state.globalNotifications)
  )
  const inboxNotificationNumber = useSelector((state: IAppState) =>
    selectUnreadEmailThreadsCount(state.inbox)
  )
  const dealsNotificationsNumber = useDealsNotificationsNumber()
  const chatRoomsNotificationsNumber = useChatRoomsNotificationsNumber()

  const showingsTotalNotificationCount = useSelector(
    selectShowingsTotalNotificationCount
  )

  const dispatch = useDispatch<ThunkDispatch<any, any, InboxAction>>()

  function handleEmailThreadEvent(): void {
    dispatch(fetchUnreadEmailThreadsCount())
  }

  // This is initially implemented for DE because they're using a
  // white-labeled version of help.rechat.com
  const brandHelpCenterURL = getBrandHelpCenterURL(brand)

  useEmailThreadEvents(handleEmailThreadEvent, handleEmailThreadEvent)

  const [expandedMenu, setExpandedMenu] = useState<ExpandedMenu>(null)

  const handleChange =
    (panel: ExpandedMenu) => (event: ChangeEvent<{}>, isExpanded: boolean) => {
      setExpandedMenu(isExpanded ? panel : null)
    }

  // Because of saving the last visited route to localStorage,
  // I had to use useRef here to implement componentDidUpdate
  const didMountRef: any = useRef()

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true

      const lastVisitedRoute = localStorage.getItem('last-visited-route')

      lastVisitedRoute && browserHistory.push(lastVisitedRoute)
    } else {
      localStorage.setItem('last-visited-route', pathname)
    }
  })

  return (
    <Sidenav>
      <Logo />
      <GlobalActionsButton />
      <ScrollableArea
        shadowColor={scrollableAreaShadowColor}
        style={{ flex: '1 1' }}
        hasThinnerScrollbar
      >
        <SidenavListGroup data-test="side-nav-list">
          <Accordion
            expanded={expandedMenu === 'nav-dashboard'}
            onChange={handleChange('nav-dashboard')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-dashboard-content"
              id="nav-dashboard-header"
            >
              <Acl access={dashboardAccess}>
                <SideNavLinkSummary
                  to={['/dashboard/overview']}
                  tourId="nav-dashboard"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiViewGridOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    Dashboard
                  </AccordionSummaryDiv>
                </SideNavLinkSummary>
              </Acl>
            </AccordionSummary>
          </Accordion>
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          <Accordion
            expanded={expandedMenu === 'nav-marketing'}
            onChange={handleChange('nav-marketing')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-marketing-content"
              id="nav-marketing-header"
            >
              <Acl.Marketing>
                <SideNavLinkSummary
                  to={[
                    '/dashboard/marketing',
                    '/dashboard/flows',
                    '/dashboard/agent-network',
                    '/dashboard/insights',
                    '/dashboard/websites'
                  ]}
                  tourId="nav-marketing"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiChartArc}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>Marketing</AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-marketing' ? (
                    <SvgIcon path={mdiMenuUp} />
                  ) : (
                    <SvgIcon path={mdiMenuDown} />
                  )}
                </SideNavLinkSummary>
              </Acl.Marketing>
            </AccordionSummary>
            <AccordionDetails>
              <Acl.Marketing>
                <SideNavLinkItem
                  to="/dashboard/marketing"
                  tourId="nav-Overview"
                >
                  <SideNavItemLabel>Overview</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Marketing>

              <Acl.Marketing>
                <SideNavLinkItem to="/dashboard/flows" tourId="nav-flows">
                  <SideNavItemLabel>Flows</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Marketing>

              <Acl.AgentNetwork>
                <SideNavLinkItem
                  to="/dashboard/agent-network"
                  tourId="nav-agent-network"
                >
                  <SideNavItemLabel>Agent Network</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.AgentNetwork>

              <Acl access={insightAccess}>
                <SideNavLinkItem to="/dashboard/insights" tourId="nav-insight">
                  <SideNavItemLabel>Insight</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.WEBSITES}>
                <SideNavLinkItem to="/dashboard/websites" tourId="nav-websites">
                  <SideNavItemLabel>Website</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-properties'}
            onChange={handleChange('nav-properties')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-properties-content"
              id="nav-properties-header"
            >
              <Acl.Marketing>
                <SideNavLinkSummary
                  to={['/dashboard/mls']}
                  tourId="nav-properties"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiGoogleMaps}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>Properties</AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                </SideNavLinkSummary>
              </Acl.Marketing>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-people'}
            onChange={handleChange('nav-people')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-people-content"
              id="nav-people-header"
            >
              <Acl access={dashboardAccess}>
                <SideNavLinkSummary
                  to={[
                    '/dashboard/inbox',
                    '/dashboard/calendar',
                    '/dashboard/contacts'
                  ]}
                  tourId="nav-people"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiAccountSupervisorOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>
                      People
                      {inboxNotificationNumber ||
                      chatRoomsNotificationsNumber ? (
                        <AccordionSummaryDot />
                      ) : (
                        ''
                      )}
                    </AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-people' ? (
                    <SvgIcon path={mdiMenuUp} />
                  ) : (
                    <SvgIcon path={mdiMenuDown} />
                  )}
                </SideNavLinkSummary>
              </Acl>
            </AccordionSummary>
            <AccordionDetails>
              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/inbox" tourId="nav-inbox">
                  <MenuBadge
                    badgeContent={inboxNotificationNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Email</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/calendar" tourId="nav-calendar">
                  <SideNavItemLabel>Calendar</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/contacts" tourId="nav-contacts">
                  <SideNavItemLabel>Contacts</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              {user && (
                <Accordion
                  expanded={expandedMenu === 'nav-chat'}
                  onChange={handleChange('nav-chat')}
                  classes={{
                    root: classes.accordionRoot,
                    expanded: classes.accordionExpanded
                  }}
                >
                  <AccordionSummary
                    aria-controls="nav-chat-content"
                    id="nav-chat-header"
                  >
                    <SideNavItem>
                      <MessagesDrawerTrigger>
                        <MenuBadge
                          badgeContent={chatRoomsNotificationsNumber}
                          color="primary"
                        >
                          Chat
                        </MenuBadge>
                      </MessagesDrawerTrigger>
                    </SideNavItem>
                  </AccordionSummary>
                </Accordion>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-transaction'}
            onChange={handleChange('nav-transaction')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-transaction-content"
              id="nav-transaction-header"
            >
              <Acl.Marketing>
                <SideNavLinkSummary
                  to={[
                    '/dashboard/deals',
                    '/dashboard/listings',
                    '/dashboard/tours',
                    '/dashboard/open-house',
                    '/dashboard/showings'
                  ]}
                  tourId="nav-transaction"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiChartArc}
                      size={muiIconSizes.small}
                      rightMargined
                    />
                    <AccordionSummaryLabel>
                      Transactions
                      {dealsNotificationsNumber ||
                      showingsTotalNotificationCount ? (
                        <AccordionSummaryDot />
                      ) : (
                        ''
                      )}
                    </AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                  {expandedMenu === 'nav-transaction' ? (
                    <SvgIcon path={mdiMenuUp} />
                  ) : (
                    <SvgIcon path={mdiMenuDown} />
                  )}
                </SideNavLinkSummary>
              </Acl.Marketing>
            </AccordionSummary>
            <AccordionDetails>
              <Acl access={dealsAccess}>
                <SideNavLinkItem to="/dashboard/deals" tourId="nav-deals">
                  <MenuBadge
                    badgeContent={dealsNotificationsNumber}
                    color="primary"
                  >
                    <SideNavItemLabel>Deals</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl>

              <Acl access={listingsAccess}>
                <SideNavLinkItem to="/dashboard/listings" tourId="nav-listings">
                  <SideNavItemLabel>Listings</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl.Crm>
                <SideNavLinkItem to="/dashboard/tours" tourId="nav-tours">
                  <SideNavItemLabel>Tours</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl.Crm>

              <Acl access={openHouseAccess}>
                <SideNavLinkItem
                  to="/dashboard/open-house"
                  tourId="nav-open-house"
                >
                  <SideNavItemLabel>Open House</SideNavItemLabel>
                </SideNavLinkItem>
              </Acl>

              <Acl access={ACL.SHOWINGS}>
                <SideNavLinkItem to="/dashboard/showings">
                  <MenuBadge
                    badgeContent={showingsTotalNotificationCount}
                    color="primary"
                  >
                    <SideNavItemLabel>Showings</SideNavItemLabel>
                  </MenuBadge>
                </SideNavLinkItem>
              </Acl>
            </AccordionDetails>
          </Accordion>
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          {user && (
            <Accordion
              expanded={expandedMenu === 'nav-notifications'}
              onChange={handleChange('nav-notifications')}
              classes={{
                root: classes.accordionRoot,
                expanded: classes.accordionExpanded
              }}
            >
              <AccordionSummary
                aria-controls="nav-notifications-content"
                id="nav-notifications-header"
              >
                <SideNavLinkSummary
                  to={['/dashboard/notifications']}
                  tourId="nav-notifications"
                  onClick={setExpandedMenu}
                >
                  <AccordionSummaryDiv>
                    <MenuBadge badgeContent={appNotifications} color="primary">
                      <SvgIcon
                        path={mdiAlarmLightOutline}
                        size={muiIconSizes.small}
                        rightMargined
                      />

                      <AccordionSummaryLabel>
                        Notifications
                      </AccordionSummaryLabel>
                    </MenuBadge>
                  </AccordionSummaryDiv>
                </SideNavLinkSummary>
              </AccordionSummary>
            </Accordion>
          )}
          <Divider className={classes.divider} />
        </SidenavListGroup>

        <SidenavListGroup>
          <Accordion
            expanded={expandedMenu === 'nav-help-center'}
            onChange={handleChange('nav-help-center')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-help-center-content"
              id="nav-help-center-header"
            >
              <SideNavItem>
                <SidenavBlankLink
                  target="_blank"
                  rel="noopener noreferrer"
                  href={brandHelpCenterURL}
                >
                  <AccordionSummaryDiv>
                    <SvgIcon
                      path={mdiHelpCircleOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />

                    <AccordionSummaryLabel>Help Center</AccordionSummaryLabel>
                  </AccordionSummaryDiv>
                </SidenavBlankLink>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>

          <Accordion
            expanded={expandedMenu === 'nav-support'}
            onChange={handleChange('nav-support')}
            classes={{
              root: classes.accordionRoot,
              expanded: classes.accordionExpanded
            }}
          >
            <AccordionSummary
              aria-controls="nav-support-content"
              id="nav-support-header"
            >
              <SideNavItem>
                <SupportTrigger>
                  <MenuBadge
                    badgeContent={chatRoomsNotificationsNumber}
                    color="primary"
                  >
                    <SvgIcon
                      path={mdiPhoneOutline}
                      size={muiIconSizes.small}
                      rightMargined
                    />

                    <AccordionSummaryLabel>Support</AccordionSummaryLabel>
                  </MenuBadge>
                </SupportTrigger>
              </SideNavItem>
            </AccordionSummary>
          </Accordion>
        </SidenavListGroup>
      </ScrollableArea>

      <UserMenu user={user} />
      <PoweredBy />
    </Sidenav>
  )
}

export default withRouter(Menu)
