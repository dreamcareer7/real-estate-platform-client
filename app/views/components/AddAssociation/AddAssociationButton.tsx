import React, { ReactNode } from 'react'
import { ButtonBase, Tooltip, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

export const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(0, 0.5),
    verticalAlign: 'text-bottom',
    whiteSpace: 'nowrap',
    color: theme.palette.action.active,
    ...theme.typography.body1
  }
}))

interface Props {
  children: ReactNode
  disabled: boolean
  showTitle?: boolean
  Icon: ReactNode
  onClick: () => void
  title: string
}

export function AddAssociationButton({
  children,
  disabled,
  Icon,
  onClick,
  title,
  showTitle = false
}: Props) {
  const classes = useStyles()

  return (
    <div>
      <Tooltip title={title}>
        <ButtonBase
          disabled={disabled}
          onClick={onClick}
          className={cn({ [classes.button]: showTitle })}
        >
          {showTitle ? title : Icon}
        </ButtonBase>
      </Tooltip>
      {children}
    </div>
  )
}
