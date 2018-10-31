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
