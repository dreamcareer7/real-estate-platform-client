import React from 'react'
import { connect } from 'react-redux'
import {
  getContacts,
  removeImportResult
} from '../../../../../store_actions/contact'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import ModalImportLoading from './ModalImportLoading'
import config from '../../../../../../config/public'

class ImportOutlook extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showLoading: false
    }

    this.url = `${config.api_url}/authorize-ms-graph\
?failEvent=importFail\
&user=${this.props.userId}\
&doneEvent=importDone\
&authSuccessEvent=importSuccesfullLogin\
&client=web`
    this.loginWindows = undefined
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.importOutlook.done) {
      this.props.getContacts()
      this.props.removeImportResult()
      this.loginWindows && this.loginWindows.close()
      this.setState({
        showLoading: false
      })
    }

    if (nextProps.importOutlook.SuccessfulLogin) {
      this.setState({
        showLoading: true
      })
    }

    if (nextProps.importOutlook.failLogin) {
      this.props.removeImportResult()
      this.setState({
        showLoading: false
      })
    }
  }

  render() {
    const { SuccessfulLogin } = this.props.importOutlook

    return (
      <div className="list--secondary-button">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="tooltip">
              Integrate with Outlook to auto-import your contacts
            </Tooltip>
          }
        >
          <button
            className="c-button--shadow "
            onClick={() => {
              this.loginWindows = window.open(
                this.url,
                'myWindow',
                'width=400,height=600'
              )
            }}
          >
            Import from Outlook
          </button>
        </OverlayTrigger>
        <ModalImportLoading show={SuccessfulLogin} />
      </div>
    )
  }
}

export default connect(
  ({ contacts, user }) => ({
    importOutlook: contacts.importOutlook,
    user
  }),
  { getContacts, removeImportResult }
)(ImportOutlook)
