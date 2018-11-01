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