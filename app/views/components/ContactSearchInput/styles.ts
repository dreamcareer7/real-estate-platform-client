import { makeStyles } from '@material-ui/core'

export default makeStyles(
  theme => ({
    root: {
      maxHeight: '60vh',
      overflow: 'auto',
      '&.has-border': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius
      }
    },
    row: {
      padding: theme.spacing(1),
      transition: theme.transitions.create('background-color'),
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        cursor: 'pointer'
      }
    },
    newClientAvatar: {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: theme.palette.common.white
    },
    newClient: {
      color: theme.palette.secondary.main
    },
    rowContent: {
      paddingLeft: theme.spacing(2)
    },
    email: {
      color: theme.palette.grey[500]
    },
    searchInput: {
      padding: theme.spacing(1, 0)
    }
  }),
  { name: 'ContactSearchInput' }
)
