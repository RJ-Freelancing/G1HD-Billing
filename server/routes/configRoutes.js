import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/configValidation'
import { updateConfig } from '../controllers/configController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

  router.route('/')
  .put(
    passportJWT,
    validateBody(schemas.configSchema),
    updateConfig
  )

export default router