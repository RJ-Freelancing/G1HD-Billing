import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().error(new Error('ID should be a valid ObjectID.'))
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
    joinedDate: Joi.date().iso(),
    parentID: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
    creditsAvailable: Joi.number(),
    creditsOnHold: Joi.number()
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
