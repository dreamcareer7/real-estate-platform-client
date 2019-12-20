import React from 'react'
import fecha from 'fecha'
import { Link, Typography } from '@material-ui/core'

interface Props {
  title: string
  description: string
  dueDate: number
  onClick: (rowDate) => void
}

export default function Info({ title, description, dueDate, onClick }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd, MMM DD YYYY hh:mm A'
  )

  return (
    <>
      <Typography variant="button" noWrap>
        <Link role="button" onClick={onClick} color="inherit">
          {title}
        </Link>
      </Typography>
      <Typography variant="body2" color="textSecondary" noWrap>
        {date}
        {description && (
          <Typography variant="inherit" color="inherit">
            &nbsp;&nbsp;|&nbsp;&nbsp;{description}
          </Typography>
        )}
      </Typography>
    </>
  )
}