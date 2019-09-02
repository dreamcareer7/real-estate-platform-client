import React, { useContext } from 'react'
import { Button } from '@material-ui/core'

import { deleteTask } from 'models/tasks/delete-task'

import SplitButton from 'components/SplitButton'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import config from '../../../../../../../config/public'

interface Props {
  activeBrandId: UUID
  reloadList: () => void
  openHouse: ICRMTask<CRMTaskAssociation, CRMTaskAssociationType>
}

export default function Actions({
  activeBrandId,
  openHouse,
  reloadList
}: Props) {
  const confirmation = useContext(ConfirmationModalContext)
  const registerPageURL = `${config.app.url}/openhouse/${
    openHouse.id
  }/${activeBrandId}/register`

  const handleDelete = async () => {
    await deleteTask(openHouse.id)
    reloadList()
  }

  const onDelete = e => {
    e.stopPropagation()

    confirmation.setConfirmationModal({
      message: 'Delete Open House',
      description: `Are you sure about deleting "${openHouse.title}"?`,
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => handleDelete()
    })
  }

  return (
    <SplitButton
      color="secondary"
      variant="outlined"
      popperPlacement="bottom-end"
      style={{ display: 'flex', justifyContent: 'flex-end' }}
      onClick={() => window.open(registerPageURL)}
      renderMenu={() => (
        <>
          <Button onClick={onDelete}>Delete</Button>
        </>
      )}
    >
      Guest Registrants Page
    </SplitButton>
  )
}
