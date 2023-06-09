import { IAssigneeApiResponse } from '@app/components/Pages/Dashboard/Contacts/Profile/Assignee/types'

import Fetch from '../../services/fetch'

/**
 * Adds contacts to a CRM flow
 */

export async function addAssignee(
  id: UUID,
  data: { assignees: IAssigneeApiResponse[] }
): Promise<ApiResponseBody<INormalizedContact>> {
  try {
    const response = await new Fetch()
      .put(`/contacts/${id}/assignees`)
      .query({
        associations: [
          'contact_role.user',
          'contact_role.brand',
          'contact.assignees'
        ]
      })
      .send(data)

    return response.body
  } catch (error) {
    throw error
  }
}
