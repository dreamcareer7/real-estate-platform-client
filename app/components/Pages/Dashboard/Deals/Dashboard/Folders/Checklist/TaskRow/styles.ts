import { makeStyles, Theme } from '@material-ui/core'

interface StyleProps {
  index: number
}

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: ({ index }: StyleProps) => ({
      position: 'relative',
      backgroundColor: index % 2 === 0 ? theme.palette.grey['50'] : '#fff'
    }),
    row: {
      position: 'relative',
      minHeight: theme.spacing(8),
      '& .visible-on-hover': {
        visibility: 'hidden'
      },
      '&:hover .visible-on-hover': {
        visibility: 'visible'
      },
      '&:hover .hide-on-hover': {
        visibility: 'hidden'
      },
      '&:hover': {
        backgroundColor: theme.palette.info.ultralight
      }
    },
    iconContainer: {
      margin: theme.spacing(0, 1.5)
    },
    actions: {
      position: 'absolute',
      right: theme.spacing(2),
      height: '100%'
    },
    title: {
      ...theme.typography.body2,
      lineHeight: 1,
      marginRight: theme.spacing(1)
    },
    link: {
      color: '#000',
      '&:hover': {
        cursor: 'pointer',
        color: theme.palette.secondary.main
      }
    },
    verticalGuideLine: {
      position: 'absolute',
      left: theme.spacing(3),
      top: theme.spacing(6),
      bottom: theme.spacing(4),
      width: '1px',
      borderLeft: `1px dashed ${theme.palette.grey['500']}`
    },
    caption: {
      color: theme.palette.grey['700']
    }
  }),
  {
    name: 'Checklists-TaskRow'
  }
)
