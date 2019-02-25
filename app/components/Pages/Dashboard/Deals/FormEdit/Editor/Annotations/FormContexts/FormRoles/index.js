import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import ContextAnnotation from '../ContextAnnotation'
import { getRolesText } from '../../../../utils/get-roles-text'
import { getRoleTooltip } from '../../../../utils/get-role-tooltip'

class FormRoles extends React.PureComponent {
  componentDidMount() {
    this.initialize()
  }

  roles = []

  initialize = () => {
    _.each(this.props.roles, (list, roleName) => {
      const info = this.props.roles[roleName]
      const groups = _.groupBy(
        info,
        item => `${item.role.sort().join('_')}-${item.attribute}-${item.group}`
      )

      _.each(groups, (group, groupIndex) => {
        const annotationContext = groups[groupIndex][0]
        const annotations = groups[groupIndex].map(info => info.annotation)
        const formValue = this.props.formValues[
          annotationContext.annotation.fieldName
        ]

        const text =
          formValue ||
          getRolesText(
            this.props.dealsRoles,
            this.props.deal,
            roleName,
            annotationContext
          )

        this.roles.push({
          contextType: 'Roles',
          groupIndex,
          roleName,
          annotations,
          annotationContext,
          text
        })
      })
    })
  }

  render() {
    return (
      <Fragment>
        {this.roles.map(item => (
          <ContextAnnotation
            key={`${item.roleName}-${item.groupIndex}`}
            annotationContext={item.annotationContext}
            annotations={item.annotations}
            value={item.text}
            maxFontSize={20}
            readOnly={item.annotationContext.isReadOnly}
            tooltip={getRoleTooltip(item.annotationContext, true)}
            onClick={bounds =>
              item.annotationContext.readonly !== true &&
              this.props.onClick('Role', {
                bounds,
                ...item
              })
            }
            onSetValues={this.props.onSetValues}
          />
        ))}
      </Fragment>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    dealsRoles: deals.roles
  }
}

export default connect(mapStateToProps)(FormRoles)
