import { flatMap, uniqBy } from 'lodash'

import { notDeleted } from 'utils/not-deleted'

export function getTeamUsers(team: ITeam): IUser[] {
  return uniqBy(
    flatMap(
      (team.roles || [])
        .filter(notDeleted)
        .map(role =>
          (role.users || []).filter(notDeleted).map(roleUser => roleUser.user)
        )
    ),
    'id'
  )
}
