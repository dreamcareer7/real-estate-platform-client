import { createValertOptions } from '@app/components/Pages/Dashboard/MLS/helpers/get-listings-helpers'

import Fetch from '../../../services/fetch'

export const byValert = async <T extends {}>(
  filters: ReturnType<typeof createValertOptions> | T,
  query: string | object = {}
): Promise<number> => {
  try {
    const response = await new Fetch()
      .post('/valerts/count')
      .send(filters)
      .query(query)

    const { info } = response.body

    return info.total
  } catch (error) {
    throw error
  }
}
