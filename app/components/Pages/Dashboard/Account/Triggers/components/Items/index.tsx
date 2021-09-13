import { Grid, Typography, Theme, makeStyles } from '@material-ui/core'

import { Item } from './components/Item'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacing(2)
    },
    title: {
      marginBottom: theme.spacing(1.5)
    }
  }),
  {
    name: 'GlobalTriggerItems'
  }
)

interface Props {
  list: Nullable<IGlobalTrigger[]>
}

export function TriggerItems({ list }: Props) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2" className={classes.title}>
        Default Templates
      </Typography>
      <Grid container alignItems="flex-start" className={classes.container}>
        {list?.map(trigger => (
          <Grid key={trigger.event_type} item md={4}>
            <Item trigger={trigger} />
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
