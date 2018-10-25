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
        _id: action.payload.data.user._id,
        username: action.payload.data.user.username,
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