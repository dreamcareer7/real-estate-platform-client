import { Grid, Divider, makeStyles } from '@material-ui/core'

import { getFileType } from 'utils/file-utils/get-file-type'

import SocialDrawerCopyLink from './SocialDrawerCopyLink'
import SocialDrawerDownloadButton from './SocialDrawerDownloadButton'
import SocialDrawerInstagramButton from './SocialDrawerInstagramButton'
import SocialDrawerSendSMS from './SocialDrawerSendSMS'
import { useSetSocialDrawerStep } from './use-set-social-drawer-step'

const useStyles = makeStyles(
  theme => ({
    row: { margin: theme.spacing(4, 0) },
    action: { marginBottom: theme.spacing(4) }
  }),
  { name: 'SocialDrawerActions' }
)

interface SocialDrawerActionsProps {
  className?: string
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerActions({
  className,
  instance
}: SocialDrawerActionsProps) {
  const classes = useStyles()
  const setStep = useSetSocialDrawerStep()

  const isSocialMedium =
    instance.type === 'template_instance' &&
    instance.template.medium === 'Social'

  // Currently, we only support Instagram posts for social template instance
  const shouldShowInstagramButton = isSocialMedium

  const gotoScheduleStep = () => setStep('Schedule')

  const isPDFType =
    instance.type === 'template_instance' &&
    getFileType(instance.file) === 'pdf'

  return (
    <div className={className}>
      <div className={classes.row}>
        <Grid container spacing={2}>
          {shouldShowInstagramButton && (
            <Grid item sm={6}>
              <SocialDrawerInstagramButton onClick={gotoScheduleStep} />
            </Grid>
          )}
          <Grid item sm={shouldShowInstagramButton ? 6 : 12}>
            <SocialDrawerDownloadButton instance={instance} />
          </Grid>
        </Grid>
      </div>
      <Divider />
      <div className={classes.row}>
        {!isPDFType && (
          <SocialDrawerSendSMS className={classes.action} instance={instance} />
        )}
        <SocialDrawerCopyLink className={classes.action} instance={instance} />
      </div>
    </div>
  )
}

export default SocialDrawerActions
