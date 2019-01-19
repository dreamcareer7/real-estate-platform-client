import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { addNotification as notify } from 'reapop'
import Downshift from 'downshift'

import _ from 'underscore'

import { changeNeedsAttention, voidEnvelope } from 'actions/deals'
import { confirmation } from 'actions/confirmation'
import { isBackOffice } from 'utils/user-teams'

import Deal from 'models/Deal'

import ArrowDownIcon from 'components/SvgIcons/KeyboardArrowDown/IconKeyboardArrowDown'

import { selectActions } from './helpers/select-actions'

import Message from '../../../Chatroom/Util/message'
import GetSignature from '../../Signature'
import UploadManager from '../../UploadManager'

import {
  Container,
  PrimaryAction,
  MenuButton,
  MenuContainer,
  MenuItem
} from './styled'

class ActionsButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isMenuOpen: false,
      isSignatureFormOpen: false
    }

    this.actions = {
      upload: this.handleUpload,
      view: this.handleView,
      'get-signature': this.handleGetSignature,
      'edit-form': this.handleEditForm,
      'notify-office': this.handleNotifyOffice,
      'resend-envelope': this.handleResendEnvelope,
      'void-envelope': this.handleVoidEnvelope
    }
  }

  handleSelectAction = e => {
    const { type } = e.target.dataset

    this.handleCloseMenu()

    console.log('>>>>', type, this.actions)
    this.actions[type] && this.actions[type]()
  }

  handleCloseMenu = () => this.setState({ isMenuOpen: false })

  handleToggleMenu = () =>
    this.setState(state => ({ isMenuOpen: !state.isMenuOpen }))

  handleDeselectAction = () =>
    this.setState({
      isSignatureFormOpen: false
    })

  getActions = () => {
    let conditions = {}

    if (this.props.type === 'attachment') {
      conditions = this.generateAttachmentConditions()
    }

    if (this.props.type === 'task') {
      conditions = this.generateTaskConditions()
    }

    return selectActions(this.props.type, conditions)
  }

  generateAttachmentConditions = () => {
    console.log('++++')

    return {}
  }

  generateTaskConditions = () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    return {
      task_type: this.props.task.task_type,
      file_uploaded: this.hasTaskAttachments(this.props.task),
      form_saved: this.props.task.submission !== null,
      envelope_status: this.getLastEnvelopeStatus(envelopes)
    }
  }

  hasTaskAttachments = task =>
    Array.isArray(task.room.attachments) && task.room.attachments.length > 0

  getTaskEnvelopes = task => {
    const envelopes = Object.values(this.props.envelopes)
      .filter(envelope =>
        envelope.documents.some(document => {
          if (task.submission && task.submission.id === document.submission) {
            return true
          }

          return (
            Array.isArray(task.room.attachments) &&
            task.room.attachments.some(
              attachment => document.file === attachment.id
            )
          )
        })
      )
      .sort((a, b) => b.created_at - a.created_at)

    return envelopes
  }

  getLastEnvelopeStatus = envelopes => {
    if (envelopes.length === 0) {
      return 'None'
    }

    const status = envelopes[0].status
    const states = ['Delivered', 'Declined', 'Voided', 'Completed']

    return states.includes(status) ? status : 'None'
  }

  getPrimaryAction = actions =>
    _.find(actions, properties => properties.primary === true)

  getSecondaryActions = actions =>
    _.filter(actions, properties => properties.primary !== true)

  notifyOffice = async comment => {
    if (comment) {
      // send message
      Message.postTaskComment(this.props.task, {
        comment,
        author: this.props.user.id,
        room: this.props.task.room.id
      })
    }

    await this.props.changeNeedsAttention(
      this.props.deal.id,
      this.props.task.id,
      true
    )

    this.props.notify({
      title: 'Admin notification is sent.',
      status: 'success'
    })
  }

  resendEnvelope = async () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    await Deal.resendEnvelope(envelopes[0].id)

    this.props.notify({
      title: 'e-Signature is resent',
      status: 'success'
    })
  }

  voidEnvelope = async () => {
    const envelopes = this.getTaskEnvelopes(this.props.task)

    try {
      await this.props.voidEnvelope(this.props.deal.id, envelopes[0].id)

      this.props.notify({
        title: 'e-Signature is voided',
        status: 'success'
      })
    } catch (e) {
      console.log(e)

      this.props.notify({
        message: 'Can not void this eSign',
        status: 'error'
      })
    }
  }

  /**
   *
   */
  handleUpload = () => this.dropzone.open()

  /**
   *
   */
  handleVoidEnvelope = () => {
    this.props.confirmation({
      message: 'Void Envelope?',
      confirmLabel: 'Resend',
      onConfirm: this.voidEnvelope
    })
  }

  /**
   *
   */
  handleNotifyOffice = () => {
    this.props.confirmation({
      message: 'Notify Office?',
      confirmLabel: 'Notify Office',
      needsUserEntry: true,
      inputDefaultValue: '',
      onConfirm: this.notifyOffice
    })
  }

  /**
   *
   */
  handleResendEnvelope = () => {
    this.props.confirmation({
      message: 'Resend Envelope?',
      confirmLabel: 'Resend',
      onConfirm: this.resendEnvelope
    })
  }

  /**
   *
   */
  handleEditForm = () =>
    browserHistory.push(
      `/dashboard/deals/${this.props.deal.id}/form-edit/${this.props.task.id}`
    )

  /**
   *
   */
  handleGetSignature = () => {
    this.setState({
      isSignatureFormOpen: true
    })
  }

  /**
   *
   */
  handleView = () => {
    if (this.props.type === 'task' && !this.props.isBackOffice) {
      window.open(this.props.task.submission.file.url, '_blank')

      return
    }

    browserHistory.push(
      `/dashboard/deals/${this.props.deal.id}/view/${this.props.task.id}`
    )
  }

  render() {
    const actionButtons = this.getActions()
    const primaryAction = this.getPrimaryAction(actionButtons)

    if (!primaryAction) {
      return false
    }

    return (
      <React.Fragment>
        <Downshift
          isOpen={this.state.isMenuOpen}
          onOuterClick={this.handleCloseMenu}
        >
          {({ isOpen }) => (
            <div style={{ position: 'relative' }}>
              <Container>
                <PrimaryAction
                  onClick={this.handleSelectAction}
                  data-type={primaryAction.type}
                >
                  {primaryAction.label}
                </PrimaryAction>

                <MenuButton onClick={this.handleToggleMenu}>
                  <ArrowDownIcon
                    style={{
                      transform: isOpen ? 'rotateX(180deg)' : 'initial'
                    }}
                  />
                </MenuButton>
              </Container>

              {isOpen && (
                <MenuContainer>
                  {this.getSecondaryActions(actionButtons).map(
                    (button, index) => (
                      <MenuItem
                        key={index}
                        data-type={button.type}
                        onClick={this.handleSelectAction}
                      >
                        {button.label}
                      </MenuItem>
                    )
                  )}
                </MenuContainer>
              )}
            </div>
          )}
        </Downshift>

        <UploadManager
          onRef={ref => (this.dropzone = ref)}
          task={this.props.task}
          disableClick
        >
          <div />
        </UploadManager>

        <GetSignature
          isOpen={this.state.isSignatureFormOpen}
          deal={this.props.deal}
          onClose={this.handleDeselectAction}
          defaultAttachments={[
            {
              type: 'form',
              task: this.props.task
            }
          ]}
        />
      </React.Fragment>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    user,
    envelopes: deals.envelopes,
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  {
    changeNeedsAttention,
    voidEnvelope,
    confirmation,
    notify
  }
)(ActionsButton)
