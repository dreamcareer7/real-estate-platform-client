import React from 'react'
import fecha from 'fecha'
import { Typography } from '@material-ui/core'

interface Props {
  dueDate: number
}

export default function Info({ dueDate }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'ddd, MMM DD YYYY hh:mm a'
  )

  return (
    <Typography variant="body2" color="textSecondary" noWrap>
      {date}
    </Typography>
  )
}
