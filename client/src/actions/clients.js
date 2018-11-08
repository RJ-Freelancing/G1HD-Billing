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
