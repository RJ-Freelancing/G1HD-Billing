export const getUsers = () => ({
  types: ['LOADING', 'GET_USERS_SUCCESS', 'GET_USERS_FAILED'],
  payload: {
    request:{
      url: '/users',
      method: 'GET',
    }
  },
  success: '',
  failure: "Something went wrong while retrieving users!"
})

export const updateUser = (username, user) => ({
  types: ['LOADING', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_FAILED'],
  payload: {
    request:{
      url: `/users/${username}`,
      method: 'PATCH',
      data: user
    }
  },
  success: `Successfully updated account`,
  failure: "Something went wrong!"
})

export const deleteUser = userID => ({
  types: ['LOADING', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_FAILED'],
  payload: {
    request:{
      url: `/users/${userID}`,
      method: 'DELETE'
    }
  },
  success: `Successfully deleted account`,
  failure: "Something went wrong!"
})

export const getTransactions = () => ({
  types: ['LOADING', 'GET_TRANSACTIONS_SUCCESS', 'GET_TRANSACTIONS_FAILED'],
  payload: {
    request:{
      url: '/transactions',
      method: 'GET',
    }
  },
  success: '',
  failure: "Something went wrong while retrieving transactions!"
})