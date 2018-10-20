import Joi from 'joi'


export const schemas = {
  idSchema: Joi.object({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('ID should be a valid ObjectID.'))
  }),

  addSchema: Joi.object({
    macAddress: Joi.string().required().regex(/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/).error(new Error('Mac Address should be a valid Mac Address.')),
    parentID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).error(new Error('ID should be a valid ObjectID.')),
    creditsAvailable: Joi.number().positive()
  }),
  
  updateSchema: Joi.object({
    macAddress: Joi.string().regex(/^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/),
    parentID: Joi.string(),
    creditsAvailable: Joi.number().positive()
  }),
}
