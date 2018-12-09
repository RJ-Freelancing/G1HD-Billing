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


export const verifyCaptcha = token => ({
  types: ['NO_LOADING', 'VERIFY_CAPTCHA_SUCCESS', 'VERIFY_CAPTCHA_FAILED'],
  payload: {
    request:{
      url: '/verifyCaptcha',
      method: 'POST',
      data: {token}
    }
  },
  success: false,
  failure: "Something went wrong while trying to verify ReCaptcha."
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



export const getLoginActivities = () => ({
  types: ['NO_LOADING', 'GET_LOGIN_ACTIVITIES_SUCCESS', 'GET_LOGIN_ACTIVITIES_FAILED'],
  payload: {
    request:{
      url: '/auth/logindetails',
      method: 'GET',
    }
  },
  success: false,
  failure: "Something went wront when trying to retrieve login activities."
})



export const logout = () => ({
  type: 'LOGOUT'
})

