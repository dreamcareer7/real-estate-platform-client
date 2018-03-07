import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import { getStatusColorClass } from '../../../../../../utils/listing'

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedStatus: props.status
    }

    this.statusList = this.getStatues()
  }

  getStatues() {
    const { deal, isBackOffice } = this.props
    const isLeaseDeal = deal.property_type.includes('Lease')

    if (isLeaseDeal) {
      return ['Lease', 'Lease Contract', 'Leased']
    }

    return isBackOffice
      ? [
          'Active',
          'Cancelled',
          'Active Contingent',
          'Expired',
          'Active Kick Out',
          'Archived',
          'Active Option Contract',
          'Temp Off Market',
          'Pending',
          'Withdrawn',
          'Sold',
          'Withdrawn Sublisting'
        ]
      : [
          'Active Contingent',
          'Active Kick Out',
          'Active Option Contract',
          'Pending'
        ]
  }
  componentWillReceiveProps(nextProps) {
    const { show, status } = nextProps

    if (show && show !== this.props.show) {
      this.setState({ selectedStatus: status })
    }
  }
  render() {
    const { show, onClose, isBackOffice, saveText, onChangeStatus } = this.props
    const { selectedStatus } = this.state

    return (
      <Modal
        show={show}
        onHide={onClose}
        dialogClassName="modal-deal-mls-status-modal"
      >
        <Modal.Header closeButton>
          {isBackOffice ? 'Deal status' : 'Request to change status'}
        </Modal.Header>

        <Modal.Body>
          <Row>
            {this.statusList.map((status, key) => (
              <Col
                key={key}
                md={6}
                sm={6}
                xs={6}
                className="vcenter"
                style={{ cursor: 'pointer' }}
                onClick={() => this.setState({ selectedStatus: status })}
              >
                <span
                  className={cn('radio', {
                    selected: selectedStatus === status
                  })}
                >
                  <i className="fa fa-check" />
                </span>

                <span
                  className="status"
                  style={{ background: getStatusColorClass(status) }}
                />

                <span className="name">{status}</span>
              </Col>
            ))}
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button className="deal-button cancel" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="deal-button"
            onClick={() => onChangeStatus(selectedStatus)}
          >
            {saveText || 'Update'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
