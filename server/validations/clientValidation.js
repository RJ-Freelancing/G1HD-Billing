import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.'))
  }),

  addSchema: Joi.object({
    login: Joi.string().required(),
    stb_mac: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.')),
    full_name: Joi.string().required(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    tariff_plan: Joi.number()
  }),
  
  updateSchema: Joi.object({
    full_name: Joi.string(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    tariff_plan: Joi.number()
  })

}
