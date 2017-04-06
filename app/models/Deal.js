import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'

export default {
  async getDeals(params, callback) {
    const api_host = config.api_url

    const endpoint = `${api_host}/deals?associations=deal.listing`

    try {
      const response = await agent
        .get(endpoint)
        .set({ Authorization: `Bearer ${params.user}` })

      return callback(false, response)
    } catch (e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  async getSubmissions(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/submissions`

    try {
      const response = await agent
        .get(endpoint)
        .set({ Authorization: `Bearer ${params.user}` })

      return callback(false, response)
    } catch (e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  async getEnvelopes(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/envelopes`

    try {
      const response = await agent
        .get(endpoint)
        .set({ Authorization: `Bearer ${params.user}` })

      return callback(false, response)
    } catch (e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  async uploadFile(params, callback) {
    const endpoint = `${config.api_url}/deals/${params.id}/files`

    try {
      const response = await agent
        .post(endpoint)
        .set({ Authorization: `Bearer ${params.user.access_token}` })
        .attach(params.file.name, params.file)

      return callback(false, response)
    } catch (e) {
      const error = {
        status: 'error',
        response: e.response
      }
      return callback(error, false)
    }
  },
  async getForms(params) {
    const response = await agent
      .get(`${config.api_url}/forms`)
      .set({ Authorization: `Bearer ${params.token}` })

    return response
  },
  async getSubmissionForm(params) {
    const response = await agent
      .get(`${config.api_url}/forms/submissions/revisions/${params.id}`)
      .set({ Authorization: `Bearer ${params.access_token}` })

    return response
  },
  async resendEnvelopeDocs(id, access_token) {
    try {
      const response = await agent
        .post(`${config.api_url}/envelopes/${id}/resend`)
        .set({ Authorization: `Bearer ${access_token}` })

      return response.body
    } catch (e) {
      throw e
    }
  },
  async collectSignatures(deal_id, subject, documents, recipients, access_token) {
    const data = {
      deal: deal_id,
      title: subject,
      documents: _.map(documents, doc => ({ revision: doc.last_revision })),
      recipients: _.map(recipients, recipient => recipient)
    }

    try {
      const response = await agent
        .post(`${config.api_url}/envelopes`)
        .set({ Authorization: `Bearer ${access_token}` })
        .send(data)

      return response.body
    } catch (e) {
      throw e
    }
  },
  async saveSubmissionForm(params) {
    try {
      const response = await agent
        .post(`${config.app.url}/api/deals/submission/form?access_token=${params.access_token}`)
        .send({
          deal: params.deal,
          state: params.state,
          values: params.values,
          form: params.form,
          type: params.type,
          submission: params.submission
        })

      return response.body
    } catch (e) {
      throw e
    }
  },
  async searchPlaces(address) {
    try {
      const params = `address=${address}&region=us&components=administrative_area:texas` +
        `&key=${config.google.api_key}`

      const response = await agent
        .get(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)

      return response.body
    }
    catch(e) {
      throw e
    }
  },
  async searchListings(address) {
    try {
      const response = await agent
        .get(`${config.app.url}/api/listings/search?q=${address}`)

      return response.body
    }
    catch(e) {
      throw e
    }
  }
}
