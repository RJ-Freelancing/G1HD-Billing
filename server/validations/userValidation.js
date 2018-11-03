import Joi from 'joi'


export const schemas = {

  usernameSchema: Joi.object({
    param: Joi.string().required()
  }),

  addSchema: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email().error(new Error('Email Address should be a valid Email Address.')),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNo: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
    userType: Joi.string().required(),
    accountStatus: Joi.boolean().required(),
    joinedDate: Joi.date().iso()
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
    parentUsername: Joi.string(),
    childUsernames: Joi.array().items(Joi.string()).unique()
  }),

  userLoginSchema: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })

}
