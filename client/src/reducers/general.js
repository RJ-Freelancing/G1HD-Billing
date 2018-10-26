const initialState = {
  loading: false,
  notificationShow: false,
  notificationType: 'info',
  notificationMessage: '',
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
    case (action.type.match(/_SUCCESS$/) || {}).input:
      return {
        ...state,
        loading: false,
        notificationShow: true,
        notificationMessage: action.meta.previousAction.success,
        notificationType: 'success'
      }
    case (action.type.match(/_FAILED$/) || {}).input:
      return {
        ...state,
        loading: false,
        notificationShow: true,
        notificationMessage: action.meta.previousAction.failure,
        notificationType: 'error'
      }
    default:
      return state
  }
}

export default general