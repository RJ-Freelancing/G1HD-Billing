import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('ID should be a valid ObjectID.'))
  }),

  addSchema: Joi.object({
    credits: Joi.number().required(),
    description: Joi.string().required(),
    transactionFrom: Joi.string().required(),
    transactionTo: Joi.string().required()
  })

}
