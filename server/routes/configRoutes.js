import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/configValidation'
import { updateConfig, getConfig, readLog, getLogFiles } from '../controllers/configController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .put(
    passportJWT,
    validateBody(schemas.configSchema),
    updateConfig
  )
  .get(
    passportJWT,
    getConfig
  )

router.route('/log/:filename')
  .get(
    passportJWT,
    readLog
  )

router.route('/getlogfiles')
  .get(
    passportJWT,
    getLogFiles
  )

export default router