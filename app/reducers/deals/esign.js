import types from '../../constants/deals'

const initialState = {
  showCompose: false,
  showAttachments: false,
  attachments: [],
  recipients: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_ATTACHMENTS:
      return {
        ...state,
        showAttachments: action.display
      }

    case types.SHOW_COMPOSE:
      return {
        ...state,
        showCompose: action.display
      }

    case types.ADD_ATTACHMENT:
      return {
        ...state,
        attachments: [...state.attachments, action.attachment]
      }

    case types.REMOVE_ATTACHMENT:
      return {
        ...state,
        attachments: state.attachments.filter(
          attachment => attachment.id !== action.attachment.id
        )
      }

    case types.SET_RECIPIENT:
      return {
        ...state,
        recipients: [...state.recipients, action.recipient]
      }

    case types.REMOVE_RECIPIENT:
      return {
        ...state,
        recipients: _.filter(state.recipients, recp => recp.role !== action.id)
      }

    case types.CLOSE_ESIGN_WIZARD:
      return initialState

    default:
      return state
  }
}
