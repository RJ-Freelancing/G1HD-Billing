const initialState = {
  minimumTransferrableCredits: 25,
  UserAnnouncements: ''
};

const general = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_CONFIG_SUCCESS':
      return {
        ...state,
        minimumTransferrableCredits: action.payload.data.minimumTransferrableCredits,
        UserAnnouncements: action.payload.data.UserAnnouncements
      }
    case 'UPDATE_CONFIG_SUCCESS':
      return {
        ...state,
        [action.payload.data.configName]: action.payload.data.configValue
      }
    default:
      return state
  }
}

export default general