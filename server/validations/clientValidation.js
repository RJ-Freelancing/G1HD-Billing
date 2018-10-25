import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.'))
  }),

  addSchema: Joi.object({
    login: Joi.string().required(),
    stb_mac: Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.')),
    email: Joi.string().required().email().error(new Error('Email Address should be a valid Email Address.')),
    full_name: Joi.string().required(),
    phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    status: Joi.boolean().required(),
    tariff_expired_date: Joi.date().iso(),
    tariff_plan: Joi.number()
  }),
  
  updateSchema: Joi.object({
    username: Joi.string(),
    email: Joi.string().email().error(new Error('Email Address should be a valid Email Address.')),
    password: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNo: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    userType: Joi.string(),
    accountStatus: Joi.boolean(),
    joinedDate: Joi.date().iso(),
    parentID: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    childIDs: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).unique(),
    creditsAvailable: Joi.number(),
    creditsOnHold: Joi.number()
  }),

  userLoginSchema: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

}
