const initialState = {
  _id: "",
  username: "",
  token: ""
};

const auth = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        ...action.payload.data.user,
        token: action.payload.data.token,
      }
    case 'LOGIN_FAILED':
      return {
        ...state,
      }
    case 'LOGOUT':
      return {
        ...initialState
      }
    case 'UPDATE_PROFILE_SUCCESS':   
      return {
        ...state,
        ...action.payload.data
      }
    case 'UPDATE_CREDITS_AVAILABLE':
      return {
        ...state,
        creditsAvailable: state.creditsAvailable+action.payload
      }
    case (action.type.match(/_FAILED$/) || {}).input:    
      if (action.error.response.status===401)
        return {...initialState}
      else return {...state}
    default:
      return state
  }
}

export default auth