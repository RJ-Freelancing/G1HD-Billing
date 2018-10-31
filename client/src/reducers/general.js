const initialState = {
  loading: false,
  notificationShow: false,
  notificationType: 'info',
  notificationMessage: '',
  mobileView: false,
  mobileMenu: false,
  lastActiveTime: null
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
    case 'TOGGLE_MOBILE_VIEW':
      return {
        ...initialState,
        mobileView: action.payload
      }
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...initialState,
        mobileMenu: action.payload
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
      return {
        ...state,
        loading: false,
        notificationShow: Boolean(action.meta.previousAction.success),
        notificationMessage: action.meta.previousAction.success,
        notificationType: 'success'
      }
    case (action.type.match(/_FAILED$/) || {}).input:
      let notificationMessage = action.meta.previousAction.failure
      try {
        notificationMessage = action.error.response.data.error
      } catch{}
      return {
        ...state,
        loading: false,
        notificationShow: Boolean(action.meta.previousAction.failure),
        notificationMessage: notificationMessage,
        notificationType: 'error'
      }
    default:
      return state
  }
}

export default general