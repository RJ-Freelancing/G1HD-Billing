const initialState = {
  'admins': [],
  superResellers: [],
  'resellers': [],
  'clients': []
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_SUCCESS':   
      return action.payload.data
    default:
      return state
  }
}

export default users