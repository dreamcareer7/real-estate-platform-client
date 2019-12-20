import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Box } from '@material-ui/core'
import { addNotification } from 'reapop'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { UploadingAttachment } from '../../components/Attachment/UploadingAttachment'
import { IUploadingAttachment } from '../../types'

interface Props extends FieldRenderProps<any> {
  onFinish: (file: IFile) => void
  addNotification: IAsyncActionProp<typeof addNotification>
}

function UploadingAttachmentsList({ input, addNotification, ...props }: Props) {
  const handleRemove = (uploadingAttachment: IUploadingAttachment) => {
    const files = (input.value as IUploadingAttachment[]).filter(
      item => item !== uploadingAttachment
    )

    input.onChange(files as any)
  }

  const handleFinish = (file: IFile, attachment: IUploadingAttachment) => {
    handleRemove(attachment)
    props.onFinish(file)
  }

  const handleError = (e, attachment: IUploadingAttachment) => {
    handleRemove(attachment)

    // Elvis!
    const message = e ? (e.response ? e.response.body.message : null) : null

    if (e && e.code !== 'ABORTED') {
      addNotification({
        message: message || 'Could not upload file',
        status: 'error'
      })
    }

    console.log('error in uploading attachment', e)
  }

  return (
    <Box>
      {Array.isArray(input.value) &&
        (input.value as IUploadingAttachment[]).map((attachment, index) => (
          <UploadingAttachment
            key={`${index}-${attachment.file.name}`}
            attachment={attachment}
            onFinish={file => handleFinish(file, attachment)}
            onDelete={() => handleRemove(attachment)}
            onError={e => handleError(e, attachment)}
          />
        ))}
    </Box>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  return {
    addNotification: (...args: Parameters<typeof addNotification>) =>
      dispatch(addNotification(...args))
  }
}

export default connect(
  null,
  mapDispatchToProps
)(UploadingAttachmentsList)