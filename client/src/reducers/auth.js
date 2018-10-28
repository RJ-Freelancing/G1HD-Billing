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
    default:
      return state
  }
}

export default auth