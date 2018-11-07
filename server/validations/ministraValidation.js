import Joi from 'joi'


export const schemas = {

  eventSchema: Joi.object({
    ids: Joi.array().items(Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.'))),
    event: Joi.string().required()
  }),

  msgSchema: Joi.object({
    ids: Joi.array().items(Joi.string().regex(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/).required().error(new Error('ID should be a valid mac Address.'))),
    msg: Joi.string().required()
  })

}
