const initialState = {
  admins: [],
  superResellers: [],
  resellers: [],
  clients: [],
  transactions: []
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USERS_SUCCESS':   
      return {
        ...state,
        ...action.payload.data
      }
    case 'GET_TRANSACTIONS_SUCCESS':
      return {
        ...state, 
        transactions: action.payload.data
      }
    case 'ADD_CLIENT_SUCCESS':
      return {
        ...state, 
        // clients: [...state.clients, action.payload.data]
      }
    case 'UPDATE_CLIENT_SUCCESS':
      // FIND UPDATED USER AND UPDATE WITH PAYLOAD
      return {
        ...state, 
      }
    case 'DELETE_CLIENT_SUCCESS':
      return {
        ...state, 
        // clients: [...state.clients]
      }
    case 'ADD_CREDIT_SUCCESS':
      return {
        ...state, 
        transactions: [...state.transactions, action.payload.data]
      }
    case 'LOGOUT':
      return {
        ...initialState
      }
    default:
      return state
  }
}

export default users