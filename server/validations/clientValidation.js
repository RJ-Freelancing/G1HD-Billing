import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.'))
  }),

  addSchema: Joi.object({
    login: Joi.string().regex(/^\s*\S+\s*$/).error(new Error('Cannot contain whitespace.')).required(),
    stb_mac: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.')),
    full_name: Joi.string().required(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    tariff_plan: Joi.number(),
    tariff_expired_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    tariff_instead_expired: Joi.number().default(3),
    comment: Joi.string().allow("").default('')
  }),

  updateSchema: Joi.object({
    full_name: Joi.string(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    stb_mac: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).error(new Error('ID should be a valid mac Address.')),
    tariff_plan: Joi.number(),
    tariff_expired_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    comment: Joi.string().allow("").default('')
  })

}
