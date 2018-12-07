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


export const getConfig = () => ({
  types: ['NO_LOADING', 'GET_CONFIG_SUCCESS', 'GET_CONFIG_FAILED'],
  payload: {
    request:{
      url: '/config',
      method: 'GET',
    }
  },
  success: '',
  failure: "Something went wrong while retrieving config!"
})

export const updateConfig = config => ({
  types: ['LOADING', 'UPDATE_CONFIG_SUCCESS', 'UPDATE_CONFIG_FAILED'],
  payload: {
    request:{
      url: '/config',
      method: 'PUT',
      data: config
    }
  },
  success: 'Successfully updated',
  failure: "Something went wrong while retrieving config!"
})


export const upgradeUser = (username, upgradingUser) => ({
  types: ['LOADING', 'UPGRADE_USER_SUCCESS', 'UPGRADE_USER_FAILED'],
  payload: {
    request:{
      url: `/users/upgrade/${username}`,
      method: 'POST',
      data: upgradingUser
    }
  },
  success: `Successfully upgraded ${upgradingUser.username} to ${upgradingUser.userType}`,
  failure: "Something went wrong while upgrading user !"
})


export const getAllLogs = () => ({
  types: ['LOADING', 'GET_ALL_LOGS_SUCCESS', 'GET_ALL_LOGS_FAILED'],
  payload: {
    request:{
      url: '/config/getlogfiles',
      method: 'GET'
    }
  },
  success: false,
  failure: "Something went wrong while retrieving log files !"
})
 

export const readLog = (filename) => ({
  types: ['LOADING', 'READ_LOG_SUCCESS', 'READ_LOG_FAILED'],
  payload: {
    request:{
      url: `/config/log/${filename}`,
      method: 'GET'
    }
  },
  success: false,
  failure: "Something went wrong while retrieving log file !"
})