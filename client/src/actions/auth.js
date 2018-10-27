export const login = ({username, password}) => ({
  types: ['LOADING', 'LOGIN_SUCCESS', 'LOGIN_FAILED'],
  payload: {
    request:{
      url: '/auth/login',
      method: 'POST',
      data: {username, password}
    }
  },
  success: `Welcome back ${username}`,
  failure: "Invalid username/password. Please try again."
})


export const logout = () => ({
  type: 'LOGOUT'
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