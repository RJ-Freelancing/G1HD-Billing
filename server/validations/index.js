import Joi from 'joi'


export function validateParam(schema, name) {
  return (req, res, next) => {
    const result = Joi.validate({ param: req.params[name] }, schema)
    if (result.error) {
      return res.status(422).json({ error: result.error.message })
    }
    else {
      if (!req.value) req.value = {}
      if (!req.value.params) req.value.params = {}
      req.value.params[name] = result.value.param
      next()
    }
  }
}

export function validateBody(schema) {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(422).json({ error: result.error.message })
    }
    else {
      if (!req.value) req.value = {}
      if (!req.value.body) req.value.body = {}
      req.value.body = result.value
      next()
    }
  }
}