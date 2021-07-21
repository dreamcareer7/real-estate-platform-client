import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  useTheme
} from '@material-ui/core'
import { mdiCheck, mdiExclamation } from '@mdi/js'
import cn from 'classnames'

import useIsMobile from '@app/hooks/use-is-mobile'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { getFormattedAppointmentDateTime } from '../utils'

import { useShowingAppointmentStatusDetailsStyles } from './hooks'
import StepConnector from './StepConnector'

interface Props {
  appointment: IPublicShowingAppointment<'showing'>
}

export default function ShowingAppointmentCanceled({ appointment }: Props) {
  const classes = useShowingAppointmentStatusDetailsStyles()
  const theme = useTheme()
  const isMobile = useIsMobile()

  return (
    <Stepper
      orientation="vertical"
      className={classes.stepper}
      connector={isMobile ? <Box py={2} px={1} /> : <StepConnector />}
      activeStep={1}
    >
      <Step>
        <StepLabel
          className={classes.stepLabel}
          StepIconComponent={() => (
            <div
              className={cn(
                classes.stepIconContainer,
                classes.activeStepIconContainer
              )}
            >
              <SvgIcon color={theme.palette.common.white} path={mdiCheck} />
            </div>
          )}
        >
          <Typography variant="h6">Appointment Requested!</Typography>

          <Typography variant="body1" color="textSecondary">
            You set an appointment for{' '}
            <span style={{ color: theme.palette.text.primary }}>
              {getFormattedAppointmentDateTime(appointment)}
            </span>
          </Typography>
        </StepLabel>
      </Step>

      <Step>
        <StepLabel
          className={classes.stepLabel}
          StepIconComponent={() => (
            <div
              className={cn(
                classes.stepIconContainer,
                classes.warningStepIconContainer
              )}
            >
              <SvgIcon
                color={theme.palette.warning.main}
                path={mdiExclamation}
              />
            </div>
          )}
        >
          <Typography variant="h6">Appointment Has Been Cancelled!</Typography>

          <Typography variant="body1" color="textSecondary">
            {appointment.buyer_message ? (
              <>
                <strong>Cancellation Message: </strong>
                {appointment.buyer_message}
              </>
            ) : (
              'No cancellation message provided.'
            )}
          </Typography>
        </StepLabel>
      </Step>
    </Stepper>
  )
}
