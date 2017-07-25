import React from 'react'
import pure from 'recompose/pure'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import { Modal } from 'react-bootstrap'

import SuccessModal from './SuccessModal'
import ShareAlertModal from './ShareAlertModal'
import createAlert from '../../../../../../models/listings/alerts/create-alert'

const CreateAlertModal = ({
  onHide,
  isActive,
  // internals
  isSaving,
  alertTitle,
  setAlertName,
  saveAlertHandler,
  titleInputOnChange,
  hideShareAlertModal,
  successModalIsActive,
  activeShareAlertModal,
  shareAlertModalIsActive
}) =>
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
            onChange={titleInputOnChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer className="c-create-alert-modal__footer">
        <button
          onClick={saveAlertHandler}
          className={`c-create-alert-modal__button c-create-alert-modal__button--linki ${isSaving
            ? 'isSaving'
            : ''}`}
          disabled={isSaving}
          style={{ float: 'left' }}
        >
          {isSaving ? 'Saving...' : 'Save for me'}
        </button>
        <button
          onClick={activeShareAlertModal}
          className={`c-create-alert-modal__button c-create-alert-modal__button--linki ${isSaving
            ? 'isSaving'
            : ''}`}
          disabled={isSaving}
          style={{ float: 'right' }}
        >
          Save &amp; Share
        </button>
      </Modal.Footer>
    </Modal>
    <SuccessModal
      type="SAVED_ALERT"
      text="Alert Saved"
      isActive={successModalIsActive}
    />
    <ShareAlertModal
      alertTitle={alertTitle}
      onHide={hideShareAlertModal}
      isActive={shareAlertModalIsActive}
    />
  </div>

export default compose(
  pure,
  connect(({ data, search }) => ({
    user: data.user,
    searchOptions: search.options
  })),
  withState('isSaving', 'setIsSaving', false),
  withState('alertTitle', 'setAlertTitle', ''),
  withState('successModalIsActive', 'setSuccessModalIsActive', false),
  withState('shareAlertModalIsActive', 'setShareAlertModalIsActive', false),
  withHandlers({
    titleInputOnChange: ({ setAlertTitle }) => e => {
      setAlertTitle(e.target.value)
    },
    saveAlertHandler: ({
      user,
      onHide,
      isSaving,
      alertTitle,
      setIsSaving,
      searchOptions,
      alertProposedTitle,
      setSuccessModalIsActive
    }) => () => {
      const alertOptions = {
        ...searchOptions,
        limit: null,
        title: alertTitle || alertProposedTitle,
        created_by: user.id,
        room: user.personal_room
      }

      setIsSaving(true)

      createAlert(alertOptions)
        .then(alert => {
          setIsSaving(false)
          onHide()
          setSuccessModalIsActive(true)
          setTimeout(() => setSuccessModalIsActive(false), 2000)
        })
        .catch(({ message }) => {
          setIsSaving(false)
        })
    },
    hideShareAlertModal: ({ setShareAlertModalIsActive, onHide }) => () => {
      setShareAlertModalIsActive(false)
    },
    activeShareAlertModal: ({ onHide, setShareAlertModalIsActive }) => () => {
      onHide()
      setShareAlertModalIsActive(true)
    }
  })
)(CreateAlertModal)
