import Joi from 'joi'
import dateFns from 'date-fns'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).required().error(new Error('ID should be a valid mac Address.'))
  }),

  addSchema: Joi.object({
    login: Joi.string().regex(/^\s*\S+\s*$/).error(new Error('Login Cannot contain whitespace.')).required(),
    stb_mac: Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).required().error(new Error('ID should be a valid mac Address.')),
    full_name: Joi.string().required(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    tariff_plan: Joi.number(),
    tariff_expired_date: Joi.string().default(dateFns.format(new Date(), 'YYYY-MM-DD')).regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    tariff_instead_expired: Joi.number().default(3),
    comment: Joi.string().allow("").default('')
  }),

  updateSchema: Joi.object({
    full_name: Joi.string(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.number(),
    stb_mac: Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).error(new Error('ID should be a valid mac Address.')),
    tariff_plan: Joi.number(),
    tariff_expired_date: Joi.string().regex(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/),
    comment: Joi.string().allow("").default('')
  })

}
