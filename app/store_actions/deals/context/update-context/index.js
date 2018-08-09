import Deal from '../../../../models/Deal'
import { updateDeal } from '../../deal'

export function updateContext(dealId, ctx) {
  return async dispatch => {
    const deal = await Deal.updateContext(dealId, ctx)

    dispatch(updateDeal(deal))
  }
}