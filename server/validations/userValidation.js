import Joi from 'joi'


export const schemas = {
  idSchema: Joi.object({
    param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
  }),
  userRegisterSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    passwordConfirmation: Joi.string().required()
  }),
  userLoginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
}