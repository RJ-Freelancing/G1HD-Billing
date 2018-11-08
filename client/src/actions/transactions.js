export const updateCredits = (transaction) => ({
  types: ['LOADING', 'ADD_CREDIT_SUCCESS', 'ADD_CREDIT_FAILED'],
  payload: {
    request:{
      url: `/transactions`,
      method: 'POST',
      data: transaction
    }
  },
  success: `Successfully updated credits`,
  failure: "Something went wrong while adding credits!"
})
