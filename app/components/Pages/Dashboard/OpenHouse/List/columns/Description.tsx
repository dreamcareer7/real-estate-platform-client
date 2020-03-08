import React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
  description: string
}

export default function Description({ description }: Props) {
  return (
    <>
      <Typography variant="inherit" color="inherit">
        {description}
      </Typography>
    </>
  )
}
