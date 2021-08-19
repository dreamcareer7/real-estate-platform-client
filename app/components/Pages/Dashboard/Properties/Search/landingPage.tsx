import {
  Box,
  CircularProgress,
  IconButton,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core'
import { MyLocation } from '@material-ui/icons'

import Autocomplete from '@app/components/Pages/Dashboard/MLS/Search/components/Autocomplete'

const useStyles = makeStyles(theme => ({
  landingContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  landingSearchBox: {
    width: '80%',
    maxWidth: 600,
    marginTop: theme.spacing(10)
  },
  loadingLocateIcon: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(1.5)
  }
}))

interface Props {
  isGettingCurrentPosition: boolean
  onClickLocate: () => void
  onSelectPlace: () => void
}

export function LandingPage({
  isGettingCurrentPosition,
  onClickLocate,
  onSelectPlace
}: Props) {
  const classes = useStyles()

  return (
    <Box className={classes.landingContainer}>
      <Box className={classes.landingSearchBox}>
        <Box my={4}>
          <Typography variant="h4" align="center">
            Where do you want to start?
          </Typography>
        </Box>
        <Box display="flex">
          <Box flexGrow={1}>
            <Autocomplete
              fullWidth
              landingPageSearch
              onSelectPlace={onSelectPlace}
            />
          </Box>
          {isGettingCurrentPosition ? (
            <CircularProgress className={classes.loadingLocateIcon} size={21} />
          ) : (
            <Tooltip title="Get your exact location on the map">
              <IconButton aria-label="locate me" onClick={onClickLocate}>
                <MyLocation />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box mt={1} textAlign="center">
          <img
            src="/static/images/properties/search-landing-bg.jpg"
            width="450"
            alt="Search properties"
          />
        </Box>
      </Box>
    </Box>
  )
}
