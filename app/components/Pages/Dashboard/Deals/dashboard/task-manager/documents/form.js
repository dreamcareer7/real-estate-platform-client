import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { editForm } from '../../../../../../../store_actions/deals/forms'


const Form = ({
  task,
  editForm
}) => (
  <div className="deal-files-form">
    {
      task && task.form &&
      <Row className="file">
        <Col sm={1} xs={12} className="image vcenter">
          <img src="/static/images/deals/form.png" />
        </Col>

        <Col sm={5} xs={12} className="name vcenter">
          <div>Form</div>
          <div className="note">May 10 17 @ 1:15 AM</div>
        </Col>

        <Col sm={6} xs={12} className="actions vcenter">
          <button>eSigns</button>
          <button onClick={() => editForm(task)}>Edit</button>
        </Col>
      </Row>
    }

  </div>
)

export default connect(null, { editForm })(Form)
