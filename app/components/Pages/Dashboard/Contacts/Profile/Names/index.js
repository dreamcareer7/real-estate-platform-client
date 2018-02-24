import React from 'react'
import { pick } from 'lodash'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

import { upsertContactAttributes } from '../../../../../../store_actions/contacts'
import Field from './Field'

const Names = ({ names, upsertAttribute, handelOnDelete, isSaving }) => (
  <div className="c-contact-profile-card">
    <h3 className="c-contact-profile-card__title">Names</h3>
    <div className="c-contact-profile-card__body">
      <ul className="c-contact-details u-unstyled-list">
        {names &&
          names.map(field => (
            <Field
              field={field}
              isSaving={isSaving}
              key={`names_${field.type}`}
              onChange={upsertAttribute}
              onDelete={handelOnDelete}
            />
          ))}
      </ul>
    </div>
  </div>
)

function mapStateToProps(state, props) {
  const { contact: { id: contactId, sub_contacts } } = props
  let { names } = sub_contacts[0].attributes

  names = names ? getNames(names[0]) : []

  return { contactId, names }
}

const enhance = compose(
  connect(mapStateToProps, {
    upsertContactAttributes
  }),
  withState('isSaving', 'setIsSaving', false),
  withHandlers({
    upsertAttribute: ({
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async fields => {
      setIsSaving(true)

      try {
        const [field] = fields
        const { type } = field
        const { names } = contact.sub_contacts[0].attributes

        const attributes = [
          {
            ...names[0],
            [type]: field[type],
            is_primary: true
          }
        ]

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  }),
  withHandlers({
    handelOnDelete: ({
      contact,
      contactId,
      setIsSaving,
      upsertContactAttributes
    }) => async ({ type }) => {
      setIsSaving(true)

      try {
        let { names } = contact.sub_contacts[0].attributes
        const attributes = [
          {
            ...names[0],
            [type]: ''
          }
        ]

        await upsertContactAttributes({
          contactId,
          attributes
        })
      } catch (error) {
        throw error
      } finally {
        setIsSaving(false)
      }
    }
  })
)

export default enhance(Names)

function getNames(names) {
  const { id } = names
  const nameFields = {
    first_name: '-',
    middle_name: '-',
    last_name: '-',
    legal_first_name: '-',
    legal_middle_name: '-',
    legal_last_name: '-',
    nickname: '-'
  }

  const nameAttribute = {
    ...nameFields,
    ...pick(names, Object.keys(nameFields))
  }

  const getTitle = name =>
    name
      .split('_')
      .map(i => i.charAt(0).toUpperCase() + i.substr(1, i.length))
      .join(' ')

  if (Object.keys(nameAttribute).length > 0) {
    return Object.keys(nameAttribute).map(name => ({
      id,
      type: name,
      [name]: nameAttribute[name],
      title: getTitle(name)
    }))
  }
}
