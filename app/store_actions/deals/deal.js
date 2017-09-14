import _ from 'underscore'
import { normalize } from 'normalizr'
import { batchActions } from 'redux-batched-actions'
import types from '../../constants/deals'
import Deal from '../../models/Deal'
import * as schema from './schema'
import { setTasks } from './task'
import { setChecklists } from './checklist'

function setDeals(deals) {
  return {
    type: types.GET_DEALS,
    deals
  }
}

function setDealContexts(deal_id, contexts) {
  return {
    type: types.SET_DEAL_CONTEXTS,
    deal_id,
    contexts
  }
}

function addNewDeal(deal) {
  return {
    type: types.CREATE_DEAL,
    deal
  }
}

function isBackOffice(status) {
  return {
    type: types.IS_BACK_OFFICE,
    status
  }
}

export function appendChecklist(deal_id, checklist_id) {
  return {
    type: types.APPEND_CHECKLIST,
    deal_id,
    checklist_id
  }
}

export function getDeals(user, backoffice = false) {
  return async (dispatch) => {
    // set user is backoffice or not
    dispatch(isBackOffice(backoffice))

    try {
      // get deals (brand is backoffice)
      const data = await Deal.getAll(user, backoffice)

      if (data.length === 0) {
        return dispatch({ type: types.NO_DEAL })
      }

      const { entities } = normalize(data, schema.dealsSchema)
      const { deals, checklists, tasks } = entities

      batchActions([
        dispatch(setDeals(deals)),
        dispatch(setChecklists(checklists)),
        dispatch(setTasks(tasks))
      ])
    } catch(e) {
      dispatch({
        type: types.GET_DEALS_FAILED,
        name: 'Get Deals',
        message: e.response ? e.response.text : 'Can not get deals'
      })
    }
  }
}

export function createDeal(data) {
  return async (dispatch) => {
    const deal = await Deal.create(data)
    const { entities } = normalize(deal, schema.dealSchema)
    const { deals, checklists, tasks } = entities

    batchActions([
      dispatch(setTasks(tasks)),
      dispatch(setChecklists(checklists)),
      dispatch(addNewDeal(deals[deal.id]))
    ])

    return deal
  }
}

export function reloadDealContexts(dealId) {
  return async (dispatch) => {
    const deal = await Deal.getById(dealId)

    dispatch(setDealContexts(deal.id, {
      form_context: deal.form_context,
      mls_context: deal.mls_context,
      deal_context: deal.deal_context
    }))
  }
}
