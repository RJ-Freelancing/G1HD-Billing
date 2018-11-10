export const addClient = (client) => ({
  types: ['LOADING', 'ADD_CLIENT_SUCCESS', 'ADD_CLIENT_FAILED'],
  payload: {
    request:{
      url: '/clients/',
      method: 'POST',
      data: {...client}
    }
  },
  success: `Successfully added new client`,
  failure: "Something went wrong!"
})


export const updateClient = (mac, client) => ({
  types: ['LOADING', 'UPDATE_CLIENT_SUCCESS', 'UPDATE_CLIENT_FAILED'],
  payload: {
    request:{
      url: `/clients/${mac}`,
      method: 'PUT',
      data: client
    }
  },
  success: `Successfully updated client`,
  failure: "Something went wrong!"
})


export const deleteClient = (mac) => ({
  types: ['LOADING', 'DELETE_CLIENT_SUCCESS', 'DELETE_CLIENT_FAILED'],
  payload: {
    request:{
      url: `/clients/${mac}`,
      method: 'DELETE',
    }
  },
  success: `Successfully deleted the client`,
  failure: "Something went wrong while deleting the client!"
})


export const getSubscriptions = (mac) => ({
  types: ['LOADING', 'GET_SUBSCRIPTIONS_SUCCESS', 'GET_SUBSCRIPTIONS_FAILED'],
  payload: {
    request:{
      url: `/ministra/account_subscription/${mac}`,
      method: 'GET'
    }
  },
  success: false,
  failure: "Something went wrong while retrieving client subscriptions!"
})


export const addSubscription = (mac, subscribedID) => ({
  types: ['LOADING', 'ADD_SUBSCRIPTION_SUCCESS', 'ADD_SUBSCRIPTION_FAILED'],
  payload: {
    request:{
      url: `/ministra/account_subscription/${mac}`,
      method: 'PUT',
      data: {subscribed: subscribedID}
    }
  },
  success: "Successfully subscribed",
  failure: "Something went wrong while attempting to subscribe!"
})


export const removeSubscription = (mac, subscribedID) => ({
  types: ['LOADING', 'REMOVE_SUBSCRIPTION_SUCCESS', 'REMOVE_SUBSCRIPTION_FAILED'],
  payload: {
    request:{
      url: `/ministra/account_subscription/${mac}`,
      method: 'DELETE',
      data: {subscribed: subscribedID}
    }
  },
  success: "Successfully unsubscribed",
  failure: "Something went wrong while attempting to unsubscribe!"
})


export const sendEvent = event => ({
  types: ['LOADING', 'SEND_EVENT_SUCCESS', 'SEND_EVENT_FAILED'],
  payload: {
    request:{
      url: '/ministra/send_event',
      method: 'POST',
      data: event
    }
  },
  success: "Successfully sent event",
  failure: "Something went wrong while sending event!"
})