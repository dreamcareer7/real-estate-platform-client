import React from 'react'
import moment from 'moment'

import Flex from 'styled-flex-component'

import PendingIcon from 'components/SvgIcons/DealTaskPending/IconPending'
import DeclinedIcon from 'components/SvgIcons/DealTaskDeclined/IconDeclined'
import ApprovedIcon from 'components/SvgIcons/DealTaskApproved/IconApproved'

import ToolTip from 'components/tooltip'

import { Label } from './styled'

function getIcon(status) {
  switch (status) {
    case 'Pending':
    case 'Submitted':
    case 'Notified':
      return <PendingIcon />

    case 'Declined':
      return <DeclinedIcon />

    case 'Approved':
      return <ApprovedIcon />

    default:
      return false
  }
}

export default function TaskStatus(props) {
  if (!props.task) {
    return false
  }

  let status = null
  let tooltip = null

  if (props.task.review) {
    status = props.task.review.status

    const reviewTime = moment.unix(props.task.review.created_at)

    tooltip = 'Status: '
    tooltip += reviewTime.isValid()
      ? `(${status}, ${reviewTime.format('MMMM DD, YY [at] hh:mm A')})`
      : `${status}`
  }

  if (
    props.isBackOffice &&
    (status === 'Submitted' || props.task.attention_requested)
  ) {
    status = 'NEEDS ATTENTION'
  }

  if (
    !props.isBackOffice &&
    status !== 'Submitted' &&
    props.task.attention_requested
  ) {
    status = props.isDraftDeal ? 'Pending' : 'Notified'
  }

  const isRequired = status !== 'Approved' && props.task.required

  if (!status && !isRequired) {
    return null
  }

  return (
    <Flex>
      {isRequired && <Label className="Required">Required</Label>}

      <ToolTip caption={props.noTip !== true && tooltip} placement="bottom">
        <Label className={status}>
          {getIcon(status)} {status}
        </Label>
      </ToolTip>
    </Flex>
  )
}
