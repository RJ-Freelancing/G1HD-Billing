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


export const refreshToken = () => ({
  types: ['NO_LOADING', 'LOGIN_SUCCESS', 'LOGIN_FAILED'],
  payload: {
    request:{
      url: '/auth/refreshToken',
      method: 'GET',
    }
  },
  success: false,
  failure: "Something went wront when trying to refresh token."
})


export const logout = () => ({
  type: 'LOGOUT'
})

