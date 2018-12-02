import { addMonths }  from 'date-fns'
import startOfTomorrow from 'date-fns/start_of_tomorrow'


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
      return {
        ...state, 
        clients: [...state.clients, action.payload.data]
      }
    case 'ADD_USER_SUCCESS':
      const userType = action.meta.previousAction.payload.request.data.userType
      return {
        ...state, 
        [`${userType}s`]: [...state[`${userType}s`], action.payload.data.user]
      }
    case 'UPDATE_USER_SUCCESS':
      // Find the updated user and merge with payload
      let username = action.meta.previousAction.payload.request.url.split('/').pop()     
      let user = findInternalUserFromUsername(state, username)
      if (user) {
        return {
          ...state, 
          [`${user.userType}s`]: state[`${user.userType}s`].map(user => {
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
      let stb_mac = action.meta.previousAction.payload.request.url.split('/').pop()     
      return {
        ...state, 
        clients: state.clients.map(client => {
          if (client.stb_mac===stb_mac)
            return {...client, ...action.meta.previousAction.payload.request.data}
          else
            return client
        })
      }
    case 'DELETE_USER_SUCCESS':
      // Find the deleted user and remove from appropiate list
      username = action.meta.previousAction.payload.request.url.split('/').pop()     
      user = findInternalUserFromUsername(state, username)
      return {
        ...state, 
        [`${user.userType}s`]: state[`${user.userType}s`].filter(user.username===username)
      }
    case 'DELETE_CLIENT_SUCCESS':
      // Find the deleted client and remove from clients list
      stb_mac = action.meta.previousAction.payload.request.url.split('/').pop()    
      return {
        ...state, 
        clients: state.clients.filter(client=>client.stb_mac!==stb_mac)
      }
    case 'UPDATE_CREDIT_SUCCESS':          
      const {transactionTo, credits} = action.payload.data.transaction
      let transactionToUser = findInternalUserFromUsername(state, transactionTo)  
      if (transactionToUser) {
        if (transactionToUser.userType) { // Internal User
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
        } else { // Client
          transactionToUser = state.clients.find(client=>client.stb_mac===transactionTo)
          const currentAccountBalance = action.meta.previousAction.transactionToClientAccountBalance
          let tariff_expired_date = transactionToUser.tariff_expired_date
          if (!tariff_expired_date) tariff_expired_date=Date.now()
          if (credits > 0) { // Adding credits
            if (currentAccountBalance===0) {          
              tariff_expired_date = addMonths(startOfTomorrow(), credits)
            } else { // currentAccountBalance > 0
              tariff_expired_date = addMonths(transactionToUser.tariff_expired_date, credits)
            }
          } else { // Recovering Credits
            if (currentAccountBalance + credits === 0) {
              tariff_expired_date = startOfTomorrow()
            } else { // currentAccountBalance + credits > 0
              tariff_expired_date = addMonths(transactionToUser.tariff_expired_date, credits)
            }
          }
          return {
            ...state, 
            transactions: [...state.transactions, action.payload.data],
            clients: state.clients.map(client => {
              if (client.stb_mac===transactionTo)
                return {...client, accountBalance: client.accountBalance+credits, tariff_expired_date}
              else
                return client
            })
          }
        }
      } else {
        return state
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