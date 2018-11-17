const initialState = {
  admins: [],
  superResellers: [],
  resellers: [],
  clients: [],
  transactions: []
};


const findInternalUserFromUsername = (state, username) => {
  let user
  user = state.admins.find(admin=>admin.username===username)
  if (!user)
    user = state.superResellers.find(superReseller=>superReseller.username===username)
  if (!user)
    user = state.resellers.find(reseller=>reseller.username===username)
  if (!user)
    user = state.clients.find(client=>client.stb_mac===username)
  return user
}

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
    case 'ADD_USER_SUCCESS':
      return {
        ...state, 
        // clients: [...state.clients, action.payload.data]
      }
    case 'UPDATE_USER_SUCCESS':
      // Find the updated user and merge with payload
      const username = action.meta.previousAction.payload.request.url.split('/').pop()     
      const user = this.findInternalUserFromUsername(state, username)
      if (user) {
        return {
          ...state, 
          [user.userType]: state[user.userType].map(user => {
            if (user.username===username)
              return {...user, ...action.payload.data}
            else
              return user
          })
        }
      }
      return state
    case 'UPDATE_CLIENT_SUCCESS':
      // Find the updated client and merge with payload
      const stb_mac = action.meta.previousAction.payload.request.url.split('/').pop()     
      return {
        ...state, 
        clients: state.clients.map(client => {
          if (client.stb_mac===stb_mac)
            return {...client, ...action.meta.previousAction.payload.request.data}
          else
            return client
        })
      }
    case 'DELETE_CLIENT_SUCCESS':
      return {
        ...state, 
      }
    case 'UPDATE_CREDIT_SUCCESS':          
      const {transactionTo, credits} = action.payload.data.transaction[0]    
      const transactionToUser = findInternalUserFromUsername(state, transactionTo)  
      if (transactionToUser.userType) {
        return {
          ...state, 
          transactions: [...state.transactions, action.payload.data],
          [`${transactionToUser.userType}s`]: state[`${transactionToUser.userType}s`].map(user => {
            if (user.username===transactionTo)
              return {...user, creditsAvailable: user.creditsAvailable+credits}
            else
              return user
          })
        }
      } else {
        return {
          ...state, 
          transactions: [...state.transactions, action.payload.data],
          clients: state.clients.map(client => {
            if (client.stb_mac===transactionTo)
              return {...client, accountBalance: client.accountBalance+credits}
            else
              return client
          })
        }
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