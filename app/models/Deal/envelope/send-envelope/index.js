import _ from 'underscore'

import Fetch from '../../../../services/fetch'

/**
 * send envelope
 */
export async function sendEnvelope(
  deal_id,
  subject,
  message,
  attachments,
  recipients
) {
  const data = {
    deal: deal_id,
    title: subject,
    body: message,
    documents: attachments,
    recipients: _.map(recipients, recipient => recipient)
  }

  try {
    const response = await new Fetch().post('/envelopes').send(data)

    if (response.body && ~~response.body.http === 412) {
      throw new Error(
        JSON.stringify({
          status: response.body.http,
          message: response.body.message
        })
      )
    }

    return response.body.data
  } catch (e) {
    let error = e

    try {
      error = JSON.parse(e.message)
    } catch (oops) {
      /* nothing */
    }

    throw error
  }
}