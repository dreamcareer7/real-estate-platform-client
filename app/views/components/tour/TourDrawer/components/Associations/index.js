import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import Flex from 'styled-flex-component'

import { AssociationItem } from '../../../../AssocationItem'
import { AssociationsButtons } from './Buttons'

class AssociationsComponent extends React.Component {
  addHandler = async (object = {}, handleClose) => {
    const { type } = object
    const { associations } = this.props

    if (!type) {
      return
    }

    const isDuplicate = associations.some(
      association => association[type] && association[type].id === object.id
    )

    if (!isDuplicate) {
      let nextAssociations

      const newAssociation = await this.props.handleCreate({
        [type]: object.id,
        association_type: type
      })

      if (newAssociation) {
        nextAssociations = [
          ...associations,
          {
            ...newAssociation,
            [type]: object
          }
        ]
      } else {
        nextAssociations = [
          ...associations,
          {
            [type]: object,
            association_type: type
          }
        ]
      }

      this.props.input.onChange(nextAssociations)
      handleClose()
    }
  }

  removeHandler = async (associationId, eventId) => {
    await this.props.handleDelete(associationId, eventId)

    this.props.input.onChange(
      this.props.associations.filter(a => a.id !== associationId)
    )
  }

  isRemovable = association => {
    const { defaultAssociation } = this.props

    if (!defaultAssociation) {
      return true
    }

    const { association_type } = defaultAssociation

    if (!association_type) {
      return true
    }

    const { id: defaultAssociationId } = association[association_type]
    const { id: associationId } = defaultAssociation[association_type]

    if (
      defaultAssociationId &&
      associationId &&
      defaultAssociationId === associationId
    ) {
      return true
    }

    return false
  }

  render() {
    const { associations } = this.props

    return (
      <React.Fragment>
        <Flex>
          <AssociationsButtons
            onClick={this.addHandler}
            associations={associations}
            handleSelect={this.addHandler}
            disabled={this.props.disabled}
          />
        </Flex>
        <Flex wrap>
          {this.props.associations.map((association, index) => {
            if (!association || !association.association_type) {
              return null
            }

            return (
              <AssociationItem
                association={association}
                key={`association_${index}`}
                isRemovable={this.isRemovable(association)}
                handleRemove={this.removeHandler}
              />
            )
          })}
        </Flex>
      </React.Fragment>
    )
  }
}

export function Associations(props) {
  return (
    <Field {...props} name="associations" component={AssociationsComponent} />
  )
}

Associations.propTypes = {
  associations: PropTypes.arrayOf(PropTypes.shape()),
  handleCreate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  defaultAssociation: PropTypes.shape()
}

Associations.defaultProps = {
  associations: []
}
