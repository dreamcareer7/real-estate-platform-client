import React from 'react'
import { connect } from 'react-redux'

import OverlayDrawer from 'components/OverlayDrawer'

import ActionButton from 'components/Button/ActionButton'

import { Divider } from './styled'
import ManualEntry from './manual-entry'

import Roles from '../../../../components/roles'
import {
  getRolesText,
  getRoleText,
  normalizeRoleNames
} from '../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../utils/get-role-tooltip'
import { getAnnotationsValues } from '../../../utils/word-wrap'

class RolesDrawer extends React.Component {
  handleClose = () => this.props.onClose()

  handleSaveManualValue = value => {
    const { selectedAnnotation } = this.props
    const { annotations } = selectedAnnotation.data

    const values = getAnnotationsValues(annotations, value, {
      maxFontSize: 20
    })

    this.props.onSetValues(values, true)
    this.props.onClose()
  }

  get AllowedRoles() {
    const roles = this.props.selectedAnnotation.data.roleName

    return normalizeRoleNames(this.props.deal, roles)
  }

  get ListValue() {
    const { data } = this.props.selectedAnnotation
    const { roleName, annotationContext, contextType } = data

    let text = ''

    if (contextType === 'Roles') {
      text = getRolesText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    } else if (contextType === 'Role') {
      text = getRoleText(
        this.props.dealsRoles,
        this.props.deal,
        roleName,
        annotationContext
      )
    }

    return text ? text.trim() : ''
  }

  get DrawerTitle() {
    const { selectedAnnotation } = this.props

    if (!selectedAnnotation) {
      return false
    }

    const { data } = selectedAnnotation

    return getRoleTooltip(data.annotationContext, data.contextType === 'Roles')
  }

  onUpsertRole = () => {
    const { data } = this.props.selectedAnnotation

    const values = getAnnotationsValues(data.annotations, this.ListValue, {
      maxFontSize: 20
    })

    this.props.onSetValues(values, true)
    this.props.onClose()
  }

  render() {
    return (
      <OverlayDrawer
        isOpen
        showFooter={false}
        onClose={this.handleClose}
        closeOnBackdropClick={false}
      >
        <OverlayDrawer.Header title={this.DrawerTitle} />
        <OverlayDrawer.Body>
          <Roles
            containerStyle={{
              paddingTop: '1rem'
            }}
            showTitle={false}
            deal={this.props.deal}
            allowedRoles={this.AllowedRoles}
            onUpsertRole={this.onUpsertRole}
            onCreateRole={this.onUpsertRole}
            allowDeleteRole
          />

          <Divider />

          <ManualEntry
            selectedAnnotation={this.props.selectedAnnotation}
            formValues={this.props.formValues}
            onSave={this.handleSaveManualValue}
          />
        </OverlayDrawer.Body>
      </OverlayDrawer>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(RolesDrawer)
