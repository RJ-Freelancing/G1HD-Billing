import Joi from 'joi'


export const schemas = {

  configSchema: Joi.object({
    configName: Joi.string().required(),
    configValue: Joi.string().required()
  })

}
