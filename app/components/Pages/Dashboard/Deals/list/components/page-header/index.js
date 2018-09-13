import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import PageHeader from '../../../../../../../views/components/PageHeader'
import { Trigger as MenuTrigger } from '../../../../../../../views/components/SlideMenu'
import ActionButton from '../../../../../../../views/components/Button/ActionButton'
import ExportDeals from './export-deals'

const Header = ({
  user,
  title,
  isSideMenuOpen,
  onMenuTriggerChange,
  showCreateDeal = true
}) => (
  <PageHeader
    isFlat
    style={{ padding: '0 2rem 0 1.5rem', marginBottom: '2rem' }}
  >
    <PageHeader.Title showBackButton={false}>
      <MenuTrigger
        tooltip={isSideMenuOpen ? 'Collapse Menu' : 'Expand Menu'}
        onClick={onMenuTriggerChange}
      />
      <PageHeader.Heading>{title}</PageHeader.Heading>
    </PageHeader.Title>

    <PageHeader.Menu>
      <ExportDeals user={user} />

      {showCreateDeal && (
        <ActionButton
          style={{ marginLeft: '1rem' }}
          onClick={() => browserHistory.push('/dashboard/deals/create')}
        >
          Create New Deal
        </ActionButton>
      )}
    </PageHeader.Menu>
  </PageHeader>
)

function mapStateToProps({ user }) {
  return { user }
}

export default connect(mapStateToProps)(Header)
