import { ReactNode, MouseEvent } from 'react'
import {
  Box,
  Dialog as MDialog,
  DialogProps as MDialogProps,
  DialogTitle,
  DialogContent,
  IconButton,
  makeStyles,
  Typography
} from '@material-ui/core'
import classNames from 'classnames'

import { Close as CloseIcon } from '@material-ui/icons'

const useStyles = makeStyles(
  theme => ({
    paper: { maxWidth: 600 },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: theme.spacing(8),
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      paddingRight: theme.spacing(1)
    },
    title: { marginBottom: theme.spacing(0.5) },
    subtitle: { color: theme.palette.grey[500] }
  }),
  { name: 'Dialog' }
)

export interface DialogProps extends Omit<MDialogProps, 'title'> {
  title: ReactNode
  subtitle?: string
  hasDialogContent?: boolean
}

function Dialog({
  classes: classesProp,
  onClose,
  title,
  subtitle,
  children,
  hasDialogContent = true,
  ...otherProps
}: DialogProps) {
  const classes = useStyles()

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick')
  }

  return (
    <MDialog
      {...otherProps}
      onClose={onClose}
      fullWidth
      classes={{
        ...classesProp,
        paper: classNames(classes.paper, classesProp?.paper)
      }}
    >
      <Box className={classes.header}>
        <DialogTitle disableTypography>
          <Typography
            variant="h6"
            className={subtitle ? classes.title : undefined}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className={classes.subtitle}>
              {subtitle}
            </Typography>
          )}
        </DialogTitle>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      {hasDialogContent ? <DialogContent>{children}</DialogContent> : children}
    </MDialog>
  )
}

export default Dialog
