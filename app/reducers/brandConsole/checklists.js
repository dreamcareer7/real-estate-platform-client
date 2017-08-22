import types from '../../constants/brandConsole'
import typesDeals from '../../constants/deals'

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_CHECKLISTS:
      if (action.checklists) {
        return action.checklists
      }
      return state
    case types.ADD_CHECKLIST:
      return state.concat(action.checklist)
    case types.DELETE_CHECKLIST: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklist_id) {
          stateClone.splice(i, 1)
          break
        }
      }
      return stateClone
    }
    case typesDeals.ADD_FORM:
    case types.ADD_TASK: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklist.id) {
          stateClone[i] = action.checklist
          break
        }
      }
      return stateClone
    }
    case types.DELETE_TASK: {
      let stateClone = state.slice()
      for (let i = 0; i < stateClone.length; i++) {
        if (stateClone[i].id === action.checklistId) {
          for (let j = 0; j < stateClone[i].tasks.length; j++) {
            if (stateClone[i].tasks[j].id === action.taskId) {
              stateClone[i].tasks.splice(j, 1)
              break
            }
          }
          break
        }
      }
      console.log(state, stateClone)
      return stateClone
    }
    default:
      return state
  }
}
