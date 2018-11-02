import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('ID should be a valid ObjectID.'))
  }),

  addSchema: Joi.object({
    transactionType: Joi.string().required(),
    transaction: Joi.string().required(),
    transactionTs: Joi.date().iso().required(),
    originatedBy: Joi.string().required()
  })

}