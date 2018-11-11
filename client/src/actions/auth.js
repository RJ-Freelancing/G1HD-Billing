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

export const updateAuthCreditsAvailable = creditsAvailable => ({
  type: 'UPDATE_CREDITS_AVAILABLE',
  payload: creditsAvailable
})

export const updateAuthResellerCredits = creditsAvailable => ({
  type: 'UPDATE_AUTH_RESELLER_CREDITS',
  payload: creditsAvailable
})
