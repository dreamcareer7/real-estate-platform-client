import { makeStyles, Theme } from '@material-ui/core'

import MainLogo from './MainLogo'

const useStyles = makeStyles(
  (theme: Theme) => ({
    logo: {
      width: '100%',
      maxWidth: '140px',
      margin: theme.spacing(5, 2, 3.5)
    }
  }),
  { name: 'Logo' }
)

export default function Logo() {
  const classes = useStyles()

  return <MainLogo className={classes.logo} />
}
