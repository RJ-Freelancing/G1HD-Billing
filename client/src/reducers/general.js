const initialState = {
  loading: false,
  notificationShow: false,
  notificationType: 'info',
  notificationMessage: '',
  mobileView: false,
  mobileMenu: false
};

const general = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        loading: true,
      }
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notificationShow: false,
      }
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenu: action.payload
      }
    case 'SET_MOBILE_VIEW':
      return {
        ...state,
        mobileView: action.payload
      }
    case 'LOGOUT':
      return {
        ...initialState
      }
    case 'SET_LAST_ACTIVE':
      return {
        ...state,
        lastActiveTime: action.payload
      }
    case 'CLEAR_LAST_ACTIVE':
      return {
        ...state,
        lastActiveTime: null
      }
    case (action.type.match(/_SUCCESS$/) || {}).input:
      if (Boolean(action.meta.previousAction.success))
        return {
          ...state,
          loading: false,
          notificationShow: Boolean(action.meta.previousAction.success),
          notificationMessage: action.meta.previousAction.success,
          notificationType: 'success'
        }
      else
        return {...state, loading: false}
    case (action.type.match(/_FAILED$/) || {}).input:
      let notificationMessage = action.meta.previousAction.failure
      try {
        notificationMessage = action.error.response.data.error
      } catch{}
      if (Boolean(action.meta.previousAction.failure))
        return {
          ...state,
          loading: false,
          notificationShow: Boolean(action.meta.previousAction.failure),
          notificationMessage: notificationMessage,
          notificationType: 'error'
        }
      else
        return {...state, loading: false}
    default:
      return state
  }
}

export default general