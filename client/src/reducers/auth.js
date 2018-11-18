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
    case 'UPDATE_CREDIT_SUCCESS':              
      const {credits} = action.payload.data.transaction[0]  
      if (state.userType==='reseller') {
        const currentAccountBalance = action.meta.previousAction.transactionToClientAccountBalance
        if (credits > 0) { // Adding credits
          if (currentAccountBalance===0) {
            return {
              ...state, 
              creditsAvailable: state.creditsAvailable - 1,
              creditsOnHold: state.creditsOnHold + (credits-1)
            }
          } else { // currentAccountBalance > 0
            return {
              ...state, 
              creditsOnHold: state.creditsOnHold + credits
            }
          }
        } else { // Recovering Credits
          if (currentAccountBalance + credits === 0) {
            return {
              ...state, 
              creditsAvailable: state.creditsAvailable + 1,
              creditsOnHold: state.creditsOnHold + (credits+1)
            }
          } else { // currentAccountBalance + credits > 0
            return {
              ...state, 
              creditsOnHold: state.creditsOnHold + credits
            }
          }
        }
      } else { // Not a reseller
        return {
          ...state, 
          creditsAvailable: state.creditsAvailable + credits,
        }
      }
    case (action.type.match(/_FAILED$/) || {}).input:    
      if (action.error.response.status===401)
        return {...initialState}
      else return state
    default:
      return state
  }
}

export default auth