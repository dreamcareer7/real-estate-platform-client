import { useMemo } from 'react'

import { Box, Typography, Theme, makeStyles } from '@material-ui/core'
import { mdiAccountGroupOutline } from '@mdi/js'

import { isFetchingSelectedTeam } from '@app/reducers/user'
// import { viewAs, getActiveTeam, getActiveTeamId } from '@app/utils/user-teams'
import { getActiveTeam } from '@app/utils/user-teams'
import Loading from '@app/views/components/SvgIcons/CircleSpinner/IconCircleSpinner'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
// import { putUserSetting } from 'models/user/put-user-setting'

// import { TeamItem } from './TeamItem'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      padding: theme.spacing(2)
    },
    header: {
      display: 'block',
      color: theme.palette.grey[500],
      marginBottom: theme.spacing(1),
      textTransform: 'uppercase'
    },
    activeTeamContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    activeTeam: {
      display: 'flex',
      alignItems: 'center'
    },
    activeTeamIcon: {
      color: theme.palette.common.black,
      marginRight: theme.spacing(1.25)
    },
    switchTeam: {
      color: theme.palette.primary.main,
      cursor: 'pointer',
      ...theme.typography.button
    }
  }),
  { name: 'ActiveTeam' }
)

// interface SwitcherStatus {
//   isSwitching: boolean
//   switchedTeamId: UUID
// }
interface Props {
  user: IUser
}

export function TeamsList({ user }: Props) {
  const classes = useStyles()
  // const [switcherStatus, setSwitcherStatus] = useState<SwitcherStatus>({
  //   isSwitching: false,
  //   switchedTeamId: ''
  // })

  const activeTeam = useMemo(() => getActiveTeam(user), [user])

  console.log({ activeTeam })

  // const onClickTeam = async (teamId: string) => {
  //   setSwitcherStatus({
  //     isSwitching: true,
  //     switchedTeamId: teamId
  //   })

  //   await putUserSetting('user_filter', viewAs(user, true), teamId)

  //   window.location.reload()
  // }

  if (isFetchingSelectedTeam(user)) {
    return (
      <>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Loading />
        </Box>
      </>
    )
  }

  if (user && user.teams && user.teams.length > 0) {
    return (
      <div className={classes.container}>
        <Typography variant="overline" className={classes.header}>
          You’re working on
        </Typography>
        <div className={classes.activeTeamContainer}>
          <div className={classes.activeTeam}>
            <SvgIcon
              path={mdiAccountGroupOutline}
              className={classes.activeTeamIcon}
            />

            <Typography variant="subtitle2">
              {activeTeam?.brand.name}
            </Typography>
          </div>
          <div className={classes.switchTeam}>Change</div>
        </div>
      </div>
    )
    // return (
    //   <>
    //     {user.teams.map(team => {
    //       const teamId = team.brand.id
    //       return (
    //         <TeamItem
    //           key={team.id}
    //           disabled={switcherStatus.isSwitching}
    //           isSwitching={switcherStatus.switchedTeamId === teamId}
    //           onClick={() => onClickTeam(teamId)}
    //           selected={teamId === activeTeamId}
    //           team={team}
    //         />
    //       )
    //     })}
    //     <Divider role="separator" />
    //   </>
    // )
  }

  return null
}
