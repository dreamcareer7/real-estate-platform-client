import Fetch from '../../../services/fetch'

export async function deleteMedias(dealId, mediaIds) {
  try {
    const response = await new Fetch()
      .delete(`/deals/${dealId}/gallery/items`)
      .send({ items: mediaIds })

    // console.log(response)

    return true
  } catch (e) {
    return []
  }
}
