export const toggleMobileSideBar = (open=false) => ({
  type: 'TOGGLE_MOBILE_MENU',
  payload: open
})

export const setMobileView = (mobileView) => ({
  type: 'SET_MOBILE_VIEW',
  payload: mobileView
})


export const clearNotification = () => ({
  type: 'CLEAR_NOTIFICATION'
})


export const getTariffPlans = () => ({
  types: ['NO_LOADING', 'GET_TARIFF_PLANS_SUCCESS', 'GET_TARIFF_PLANS_FAILED'],
  payload: {
    request:{
      url: '/ministra/tariffs',
      method: 'GET',
    }
  },
  success: false,
  failure: "Something went wrong while retrieving tariff plans!"
})


export const showLoading = () => ({
  type: 'LOADING'
})

export const hideLoading = () => ({
  type: 'HIDE_LOADING'
})