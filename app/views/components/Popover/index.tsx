import React, { CSSProperties, ReactNode, useState, useRef } from 'react'

import { Popover, makeStyles, Theme } from '@material-ui/core'
import classNames from 'classnames'

import { noop } from '@app/utils/helpers'

interface Props {
  id?: string
  className?: string
  caption?: ReactNode
  placement?: 'top' | 'bottom'
  containerStyle?: CSSProperties
  show?: boolean
  dark?: boolean
  children: ReactNode
  width?: React.CSSProperties['width']
  onClose?: () => void
  popoverStyle?: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    pointerEvents: 'none'
  },
  paper: ({
    placement,
    width
  }: Required<Pick<Props, 'placement' | 'width'>>) => ({
    padding: theme.spacing(2),
    marginTop: placement === 'bottom' ? theme.spacing(2) : 0,
    marginBottom: placement === 'top' ? theme.spacing(2) : 0,
    width
  })
}))

function PopOver({
  id = 'rechat-tooltip',
  placement = 'top',
  caption,
  containerStyle,
  children,
  className = '',
  show,
  dark,
  width = 'auto',
  popoverStyle,
  onClose = noop
}: Props) {
  const classes = useStyles({ placement, width })
  const divRev = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(!!show)

  const handlePopoverOpen = () => {
    setOpen(true)
  }

  const handlePopoverClose = () => {
    setOpen(false)
    onClose()
  }

  if (!caption) {
    return <>{children}</>
  }

  return (
    <>
      <div
        style={containerStyle}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        ref={divRev}
      >
        {children}
      </div>
      <Popover
        style={popoverStyle}
        id={id}
        className={classNames(classes.popover, className)}
        classes={{
          paper: classNames(
            'pop-over',
            dark ? 'pop-over--dark' : 'pop-over--light',
            classes.paper
          )
        }}
        open={open}
        anchorEl={divRev.current}
        anchorOrigin={{
          vertical: placement === 'bottom' ? 'bottom' : 'top',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: placement === 'bottom' ? 'top' : 'bottom',
          horizontal: 'center'
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {caption}
      </Popover>
    </>
  )
}

export default PopOver
