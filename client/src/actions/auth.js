export const login = ({username, password}) => ({
  types: ['LOADING', 'LOGIN_SUCCESS', 'LOGIN_FAILED'],
  payload: {
    request:{
      url: '/auth/login',
      method: 'POST',
      data: {username, password}
    }
  },
  success: "Welcome Back",
  failure: "Invalid username/password. Please try again."
})

export const logout = () => ({
  type: 'LOGOUT'
})