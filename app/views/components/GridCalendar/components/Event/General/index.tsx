import React from 'react'
import cn from 'classnames'

import { useStyles } from '../use-style'
import { BaseEventProps } from '..'

export const GeneralEvent = ({ event, rowEvent }: BaseEventProps) => {
  const classes = useStyles()

  return (
    <div className={cn(classes.container, classes.general)}>
      <span>{event.event.title}</span>
    </div>
  )
}
