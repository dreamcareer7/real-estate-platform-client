import * as React from 'react'
import { Typography } from '@material-ui/core'

import { EmailThreadEmail } from '../types'
import { EmailRecipient } from '../../EmailRecipient'

interface Props {
  email: EmailThreadEmail
}

export function EmailItemRecipients({ email }: Props) {
  const { to = [], cc = [], bcc = [] } = email

  return (
    <>
      <Typography noWrap>
        to {[...to, ...cc].map(renderRecipient)}
        {bcc.length > 0 ? `, bcc: ${bcc.map(renderRecipient)}` : null}
      </Typography>
    </>
  )
}

function renderRecipient(recipient, index, arr) {
  return (
    <React.Fragment key={recipient + index}>
      <EmailRecipient recipient={recipient} />
      {index < arr.length - 1 && ', '}
    </React.Fragment>
  )
}
