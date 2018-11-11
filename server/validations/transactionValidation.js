import Joi from 'joi'


export const schemas = {

  addSchema: Joi.object({
    credits: Joi.number().required(),
    description: Joi.string().required(),
    transactionTo: Joi.string().required()
  })

}
