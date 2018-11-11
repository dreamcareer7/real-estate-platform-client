import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { browserHistory } from 'react-router'
import moment from 'moment'
import _ from 'underscore'
import styled from 'styled-components'
import Flex from 'styled-flex-component'

import PopOver from 'components/Popover'

import { getStartRange, getEndRange } from '../../../../reducers/calendar'
import {
  getCalendar,
  setDate,
  resetCalendar,
  setCalendarFilter
} from '../../../../store_actions/calendar'
import {
  createDateRange,
  createPastRange,
  createFutureRange
} from '../../../../models/Calendar/helpers/create-date-range'
import {
  Container,
  Menu,
  Trigger,
  Content
} from '../../../../views/components/SlideMenu'
import PageHeader from '../../../../views/components/PageHeader'
import DatePicker from '../../../../views/components/DatePicker'
import { EventDrawer } from '../../../../views/components/EventDrawer'
import CalendarTable from './Table'
import CalendarFilter from '../../../../views/components/UserFilter'
import { MenuContainer, FilterContainer } from './styled'
import ActionButton from '../../../../views/components/Button/ActionButton'
import { getActiveTeam, getActiveTeamACL } from '../../../../utils/user-teams'

const LOADING_POSITIONS = {
  Top: 0,
  Bottom: 1,
  Middle: 2
}

const CalendarExport = styled(ActionButton)`
  position: absolute;
  bottom: 0;
  margin: auto;
  left: 50%;
  transform: translateX(-50%);
`

const PopOverImage = styled.img`
  width: 40px;
  height: 40px;
`

class CalendarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpen: true,
      showCreateTaskMenu: false,
      selectedTaskId: null,
      loadingPosition: LOADING_POSITIONS.Middle
    }

    const activeTeam = getActiveTeam(this.props.user)

    this.isFilterHidden = activeTeam && activeTeam.brand.member_count <= 1
  }

  componentDidMount() {
    const { selectedDate } = this.props

    const acl = getActiveTeamACL(this.props.user)

    const hasContactsPermission = acl.includes('CRM')

    if (!hasContactsPermission) {
      browserHistory.push('/dashboard/mls')
    }

    this.restartCalendar(selectedDate)
  }

  getCalendar = async (startRange, endRange, filter) => {
    let calendarFilter = filter || this.props.filter

    if (!calendarFilter || calendarFilter.length === 0) {
      calendarFilter = [this.props.user.id]
    }

    return this.props.getCalendar(startRange, endRange, calendarFilter)
  }

  /**
   * close/open side menu
   */
  toggleSideMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  /**
   * open create task menu
   */
  openEventDrawer = () => this.setState({ showCreateTaskMenu: true })

  /**
   * close create task menu
   */
  closeEventDrawer = () =>
    this.setState({
      showCreateTaskMenu: false,
      selectedTaskId: null
    })

  /**
   * sets calendar references
   */
  onTableRef = (refId, ref) => {
    this.refs = {
      ...this.refs,
      [refId]: ref
    }
  }

  /**
   * sets the loader position
   * @param { Number } position - the position
   */
  setLoadingPosition = position =>
    this.setState({
      loadingPosition: position
    })

  restartCalendar = async (selectedDate, filter) => {
    const [newStartRange, newEndRange] = createDateRange(selectedDate)

    this.setLoadingPosition(LOADING_POSITIONS.Middle)

    this.props.resetCalendar()
    this.refs = {}

    batchActions([
      this.props.setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange, filter)
    ])

    this.scrollIntoView(selectedDate)
  }

  handleDateChange = async selectedDate => {
    const { startRange, endRange, setDate } = this.props
    const [newStartRange, newEndRange] = createDateRange(selectedDate)
    const timestamp = moment(selectedDate)
      .utcOffset(0)
      .startOf('day')
      .format('X')

    // check the new range is inside current range or not
    if (timestamp >= startRange && timestamp <= endRange) {
      setDate(selectedDate)
      this.scrollIntoView(selectedDate, {
        behavior: 'smooth'
      })

      return false
    }

    // check range is completly outside the current range or not
    if (timestamp > endRange || timestamp < startRange) {
      return this.restartCalendar(selectedDate)
    }

    this.setLoadingPosition(LOADING_POSITIONS.Middle)
    this.scrollIntoView(selectedDate, {
      behavior: 'smooth'
    })

    batchActions([
      setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])
  }

  handleFilterChange = filter => {
    this.props.setCalendarFilter(filter)
    this.setLoadingPosition(LOADING_POSITIONS.Middle)
    this.restartCalendar(this.selectedDate, filter)
  }

  onClickTask = selectedTaskId =>
    this.setState(() => ({ selectedTaskId }), this.openEventDrawer)

  handleEventChange = async (task, action) => {
    const { startRange, endRange } = this.props
    const timestamp = task.due_date

    const isInRange = timestamp >= startRange && timestamp <= endRange
    const isTaskUpdated = action === 'updated'
    const newSelectedDate = new Date(timestamp * 1000)

    this.closeEventDrawer()

    if (isInRange || isTaskUpdated) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)

      batchActions([
        this.props.resetCalendar(),
        this.props.setDate(newSelectedDate),
        await this.getCalendar(startRange, endRange)
      ])

      this.scrollIntoView(newSelectedDate)
    }
  }

  scrollIntoView = (date, options = {}) => {
    const refId = moment(date).format('YYYY-MM-DD')

    this.isObserverEnabled = false

    this.refs[refId] &&
      this.refs[refId].scrollIntoView({
        behavior: options.behavior || 'instant',
        block: 'start'
      })

    setTimeout(() => {
      this.isObserverEnabled = true
    }, 500)
  }

  loadPreviousItems = async () => {
    const { startRange } = this.props

    if (this.props.isFetching || _.isEmpty(this.props.calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Top)

    const [newStartRange, newEndRange] = createPastRange(startRange)
    const newSelectedDate = new Date(startRange * 1000)

    batchActions([
      this.props.setDate(newSelectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])

    this.scrollIntoView(newSelectedDate)
  }

  loadNextItems = async () => {
    const { endRange, isFetching, calendarDays } = this.props

    if (isFetching || _.isEmpty(calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Bottom)
    this.getCalendar(...createFutureRange(endRange))
  }

  get SelectedRange() {
    const { startRange, endRange } = this.props
    const offset = new Date().getTimezoneOffset() * 60

    const range = {
      from: new Date((~~startRange + offset) * 1000),
      to: new Date((~~endRange + offset) * 1000)
    }

    return {
      range
    }
  }

  render() {
    const { isMenuOpen, loadingPosition, selectedTaskId } = this.state
    const { selectedDate, isFetching } = this.props

    return (
      <Container isOpen={isMenuOpen}>
        {this.state.showCreateTaskMenu && (
          <EventDrawer
            isOpen
            user={this.props.user}
            eventId={selectedTaskId}
            onClose={this.closeEventDrawer}
            submitCallback={this.handleEventChange}
            deleteCallback={this.handleEventChange}
          />
        )}

        <Menu isOpen={isMenuOpen} width={302}>
          <MenuContainer>
            <DatePicker
              selectedDate={selectedDate}
              onChange={this.handleDateChange}
              // modifiers={this.SelectedRange}
            />

            <PopOver
              popoverStyles={{ width: '250px', textAlign: 'center' }}
              trigger="click"
              caption={
                <div>
                  <div>
                    Take your Rechat calendar events with you. Export them to
                    other calendars like Outlook, Google, iCal and more
                  </div>
                  <Flex style={{ marginTop: '1rem' }} justifyAround>
                    <PopOverImage src="/static/images/Calendar/outlook.png" />
                    <PopOverImage src="/static/images/Calendar/gcal.png" />
                    <PopOverImage src="/static/images/Calendar/ical.png" />
                  </Flex>
                </div>
              }
            >
              <CalendarExport
                noBorder
                appearance="outline"
                onClick={() => {
                  browserHistory.push('/dashboard/account/exportCalendar')
                }}
              >
                Calendar Export
              </CalendarExport>
            </PopOver>
          </MenuContainer>
        </Menu>

        <Content>
          <PageHeader>
            <PageHeader.Title showBackButton={false}>
              <Trigger isExpended={isMenuOpen} onClick={this.toggleSideMenu} />
              <PageHeader.Heading>Calendar</PageHeader.Heading>
            </PageHeader.Title>

            <PageHeader.Menu>
              <ActionButton onClick={this.openEventDrawer}>
                Add Event
              </ActionButton>
            </PageHeader.Menu>
          </PageHeader>
          {!this.isFilterHidden && (
            <FilterContainer>
              <CalendarFilter
                onChange={this.handleFilterChange}
                filter={this.props.filter}
              />
            </FilterContainer>
          )}
          <div style={{ position: 'relative' }}>
            <div ref={ref => (this.calendarTableContainer = ref)}>
              <CalendarTable
                positions={LOADING_POSITIONS}
                selectedDate={selectedDate}
                isFetching={isFetching}
                loadingPosition={loadingPosition}
                onScrollTop={this.loadPreviousItems}
                onScrollBottom={this.loadNextItems}
                onSelectTask={this.onClickTask}
                onRef={this.onTableRef}
                isFilterHidden={this.isFilterHidden}
              />
            </div>
          </div>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps({ user, calendar }) {
  return {
    user,
    isFetching: calendar.isFetching,
    selectedDate: moment(calendar.selectedDate)
      .utcOffset(0)
      .toDate(),
    calendarDays: calendar.byDay,
    filter: calendar.filter,
    startRange: getStartRange(calendar),
    endRange: getEndRange(calendar)
  }
}

export default connect(
  mapStateToProps,
  {
    getCalendar,
    setDate,
    resetCalendar,
    setCalendarFilter
  }
)(CalendarContainer)
