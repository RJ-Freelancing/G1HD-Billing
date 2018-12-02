import Joi from 'joi'


export const schemas = {

  usernameSchema: Joi.object({
    param: Joi.string().required()
  }),

  addSchema: Joi.object({
    username: Joi.string().regex(/^\s*\S+\s*$/).error(new Error('Cannot contain whitespace.')).required(),
    email: Joi.string().email().allow('').error(new Error('Email Address should be a valid Email Address.')),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNo: Joi.string().required().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    userType: Joi.string().required().valid(['superAdmin', 'admin', 'superReseller', 'reseller']),
    accountStatus: Joi.boolean().required(),
  }),

  updateSchema: Joi.object({
    username: Joi.string(),
    email: Joi.string().allow("").email().error(new Error('Email Address should be a valid Email Address.')),
    password: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phoneNo: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    userType: Joi.string().valid(['superAdmin', 'admin', 'superReseller', 'reseller']),
    accountStatus: Joi.boolean()
  }),

  userLoginSchema: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  upgradeSchema: Joi.object({
    username: Joi.string().required(),
    userType: Joi.string().required(),
    password: Joi.string()
  })

}
