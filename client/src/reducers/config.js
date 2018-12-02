const initialState = {
  minimumTransferrableCredits: 25,
  UserAnnouncements: '',
  enableSendEventsFor: {},
  tariffPlans: []
};

const general = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CONFIG_SUCCESS':
      return {
        ...state,
        minimumTransferrableCredits: action.payload.data.minimumTransferrableCredits,
        UserAnnouncements: action.payload.data.UserAnnouncements,
        enableSendEventsFor: action.payload.data.enableSendEventsFor
      }
    case 'UPDATE_CONFIG_SUCCESS':
      return {
        ...state,
        [action.payload.data.configName]: action.payload.data.configValue
      }
    case 'GET_TARIFF_PLANS_SUCCESS':
      return {
        ...state,
        loading: false,
        tariffPlans: action.payload.data
      }
    default:
      return state
  }
}

export default general