import Joi from 'joi'


export const schemas = {

  idSchema: Joi.object({
    param: Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).required().error(new Error('ID should be a valid mac Address.'))
  }),

  eventSchema: Joi.object({
    ids: Joi.array().items(Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).error(new Error('ID should be a valid mac Address.'))),
    event: Joi.string().required(),
    msg: Joi.string(),
    ttl: Joi.number(),
    need_reboot: Joi.number().min(0).max(1),
    channel: Joi.number()
  }),

  msgSchema: Joi.object({
    ids: Joi.array().items(Joi.string().regex(/^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/).error(new Error('ID should be a valid mac Address.'))),
    msg: Joi.string().required()
  }),

  accountSubPostSchema: Joi.object({
    subscribed: Joi.array().items(Joi.string()).required()
  }),

  accountSubPutSchema: Joi.object({
    subscribed: Joi.string(),
    unsubscribed: Joi.string()
  })

}
