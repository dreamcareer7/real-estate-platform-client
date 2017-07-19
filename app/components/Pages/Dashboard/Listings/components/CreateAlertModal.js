import S from 'shorti'
import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import createAlert from '../../../../../models/listings/alerts/create-alert'

const CreateAlertModal = ({
  onHide,
  isActive,
  // internals
  isSaving,
  setAlertName,
  saveAlertHandler,
  saveAndShareHandler
}) => {
  let $alertTilteInput
  return (
    <div>
      <Modal
        show={isActive}
        onHide={isSaving ? () => {} : onHide}
        className="c-create-alert-modal"
      >
        <Modal.Body style={{ padding: 0 }}>
          <div className="c-create-alert-modal__hero">
            <img
              className="c-create-alert-modal__hero__logo"
              src="/static/images/dashboard/mls/alert-bell.svg"
            />
            <p style={{ marginBottom: 0 }}>Get new listings faster</p>
            <p style={{ marginBottom: 0 }}>than your local MLS®</p>
          </div>
          <div style={{ padding: '2rem' }}>
            <label htmlFor="alertName" style={{ display: 'block' }}>
              Alert Name
            </label>
            <input
              id="alertName"
              type="text"
              className="c-create-alert-modal__alert-title-input"
              placeholder={'Naming your alert...'}
              ref={node => ($alertTilteInput = node)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="c-create-alert-modal__footer">
          <button
            onClick={() => saveAlertHandler($alertTilteInput.value)}
            className={`c-create-alert-modal__button ${isSaving
              ? 'isSaving'
              : ''}`}
            disabled={isSaving}
            style={{ float: 'left' }}
          >
            {isSaving ? 'Saving...' : 'Save for me'}
          </button>
          <button
            onClick={saveAndShareHandler}
            className={`c-create-alert-modal__button ${isSaving
              ? 'isSaving'
              : ''}`}
            disabled={isSaving}
            style={{ float: 'right' }}
          >
            Save &amp; Share
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default compose(
  pure,
  connect(({ data, search }) => ({
    user: data.user,
    searchOptions: search.options
  })),
  withState('isSaving', 'setIsSaving', false),
  withHandlers({
    saveAlertHandler: ({
      user,
      isSaving,
      setIsSaving,
      searchOptions,
      alertProposedTitle
    }) => title => {
      const alertOptions = {
        ...searchOptions,
        limit: null,
        title: title || alertProposedTitle,
        created_by: user.id,
        room: user.personal_room
      }

      setIsSaving(true)

      createAlert(alertOptions)
        .then(alert => {
          setIsSaving(false)
          console.log(alert)
        })
        .catch(({ message }) => {
          setIsSaving(false)
          console.log(message)
        })
    }
  })
)(CreateAlertModal)
