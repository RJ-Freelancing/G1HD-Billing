export const addUser = (user) => ({
  types: ['LOADING', 'ADD_USER_SUCCESS', 'ADD_USER_FAILED'],
  payload: {
    request:{
      url: '/users',
      method: 'POST',
      data: user
    }
  },
  success: 'Successfully added user',
  failure: "Something went wrong while adding user!"
})

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

export const updateProfile = (username, user) => ({
  types: ['LOADING', 'UPDATE_PROFILE_SUCCESS', 'UPDATE_PROFILE_FAILED'],
  payload: {
    request:{
      url: `/users/${username}`,
      method: 'PATCH',
      data: user
    }
  },
  success: `Successfully updated profile`,
  failure: "Something went wrong!"
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
  success: `Successfully updated user`,
  failure: "Something went wrong!"
})

export const deleteUser = username => ({
  types: ['LOADING', 'DELETE_USER_SUCCESS', 'DELETE_USER_FAILED'],
  payload: {
    request:{
      url: `/users/${username}`,
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