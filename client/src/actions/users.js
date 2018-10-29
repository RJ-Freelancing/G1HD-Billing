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

export const updateUser = (userID, user) => ({
  types: ['LOADING', 'UPDATE_USER_SUCCESS', 'UPDATE_USER_FAILED'],
  payload: {
    request:{
      url: `/users/${userID}`,
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