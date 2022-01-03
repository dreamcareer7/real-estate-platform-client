import { Typography, makeStyles } from '@material-ui/core'
import isBefore from 'date-fns/isBefore'

import SuperCampaignSendTime from '@app/views/components/SuperCampaignSendTime'

const useStyles = makeStyles(
  theme => ({
    date: {
      color: theme.palette.grey[500],
      textDecoration: 'none'
    }
  }),
  {
    name: 'SuperCampaignListColumnSubject'
  }
)

interface SuperCampaignListColumnSubjectProps {
  subject: Optional<string>
  dueAt: Optional<number>
}

function SuperCampaignListColumnSubject({
  subject,
  dueAt
}: SuperCampaignListColumnSubjectProps) {
  const classes = useStyles()

  const isPast = !!dueAt && isBefore(dueAt * 1000, new Date())

  return (
    <>
      <Typography variant="body1" noWrap>
        {subject || '(Untitled Campaign)'}
      </Typography>
      {dueAt && (
        <Typography className={classes.date} variant="body2">
          <SuperCampaignSendTime
            prefix={isPast ? 'Sent ' : 'Send '}
            time={dueAt}
          />
        </Typography>
      )}
    </>
  )
}

export default SuperCampaignListColumnSubject
