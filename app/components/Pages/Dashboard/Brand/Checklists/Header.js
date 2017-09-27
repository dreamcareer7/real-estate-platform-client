import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Compose from './ModalChecklist'
import { addChecklist } from '../../../../../store_actions/brandConsole'

const Header = ({ brand, addChecklist }) => {
  const AddButton = ({
    clickHandler
  }) => (
    <Button
      bsStyle="primary"
      onClick={() => clickHandler()}
    >
      Add Checklist
    </Button>
  )

  return (<div className="toolbar">
    <span className="button">
      <Compose
        TriggerButton={AddButton}
        showOnly={false}
        dropDownBox
        inline
        title="Add Checklist"
        buttonTitle="Add"
        onButtonClick={(newItem) => {
          addChecklist(brand, newItem)
        }}
      />
    </span>
  </div>
  )
}

export default connect(
  null,
  ({ addChecklist })
)(Header)

