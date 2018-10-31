export const toggleMobilView = (mobileView=false) => ({
  type: 'TOGGLE_MOBILE_VIEW',
  payload: mobileView
})

export const toggleMobileSideBar = (open=false) => ({
  type: 'TOGGLE_MOBILE_MENU',
  payload: open
})

export const setLastActiveTime = (time) => ({
  type: 'SET_LAST_ACTIVE',
  payload: time
})

export const clearLastActiveTime = () => ({
  type: 'CLEAR_LAST_ACTIVE'
})
