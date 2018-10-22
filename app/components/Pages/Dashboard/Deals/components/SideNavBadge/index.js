import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { isBackOffice } from '../../../../../../utils/user-teams'
import Badge from '../../../../../../views/components/Badge'

class BadgeCounter extends React.Component {
  constructor(props) {
    super(props)
  }

  getAgentBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (deal.new_notifications && deal.new_notifications.length > 0) {
        counter += 1
      }
    })

    return counter
  }

  getBackOfficeBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (!deal.is_draft && ~~deal.attention_requests > 0) {
        counter += 1
      }
    })

    return counter
  }

  getBadgeCount() {
    const { isBackOffice } = this.props

    return isBackOffice ? this.getBackOfficeBadge() : this.getAgentBadge()
  }

  render() {
    const counter = this.getBadgeCount()

    if (counter > 0) {
      return (
        <Badge
          style={{
            position: 'absolute',
            top: 0,
            left: '50%'
          }}
        >
          {counter > 99 ? '99+' : counter}
        </Badge>
      )
    }

    return <span />
  }
}

export default connect(({ deals, user }) => ({
  deals: deals.list,
  isBackOffice: isBackOffice(user)
}))(BadgeCounter)
