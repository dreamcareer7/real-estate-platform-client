import { Card, Box, BoxProps, Typography, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(
  theme => ({
    question: { color: theme.palette.grey[500] },
    answer: { whiteSpace: 'pre-line' }
  }),
  { name: 'ShowingDialogCard' }
)

interface ShowingDialogCardProps extends Pick<BoxProps, 'minHeight'> {
  question: string
  answer: string
  multiline?: boolean
}

function ShowingDialogCard({
  question,
  answer,
  multiline = false,
  ...otherProps
}: ShowingDialogCardProps) {
  const classes = useStyles()

  return (
    <Card variant="outlined">
      <Box mt={1} mx={2} mb={1} {...otherProps}>
        <Typography variant="body2" gutterBottom className={classes.question}>
          {question}
        </Typography>
        <Typography
          variant={!multiline ? 'h6' : 'body2'}
          className={classes.answer}
        >
          {answer}
        </Typography>
      </Box>
    </Card>
  )
}

export default ShowingDialogCard