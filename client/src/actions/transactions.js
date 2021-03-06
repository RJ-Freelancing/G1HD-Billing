export const updateCredits = (transaction, transactionToClientAccountBalance=null) => ({
  types: ['LOADING', 'UPDATE_CREDIT_SUCCESS', 'UPDATE_CREDIT_FAILED'],
  payload: {
    request:{
      url: `/transactions`,
      method: 'POST',
      data: transaction
    }
  },
  success: `Successfully updated credits`,
  failure: "Something went wrong while adding credits!",
  transactionToClientAccountBalance
})


export const getTransactions = username => ({
  types: ['NO_LOADING', 'GET_TRANSACTIONS_SUCCESS', 'GET_TRANSACTIONS_FAILED'],
  payload: {
    request:{
      url: `/transactions/${username}`,
      method: 'GET',
    }
  },
  success: '',
  failure: "Something went wrong while retrieving transactions!"
})


export const getUserTransactions = username => ({
  types: ['LOADING', 'GET_USER_TRANSACTIONS_SUCCESS', 'GET_USER_TRANSACTIONS_FAILED'],
  payload: {
    request:{
      url: `/transactions/${username}`,
      method: 'GET',
    }
  },
  success: '',
  failure: "Something went wrong while retrieving user transactions!"
})


export const increaseCredits = (transaction) => ({
  types: ['LOADING', 'INCREASE_CREDITS_SUCCESS', 'INCREASE_CREDITS_FAILED'],
  payload: {
    request:{
      url: `/transactions`,
      method: 'POST',
      data: transaction
    }
  },
  success: `Successfully increased credits`,
  failure: "Something went wrong while adding credits!",
})