import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/configValidation'
import { checkMaintenance } from '../_helpers/checkMaintenance'
import { updateConfig, getConfig, readLog, getLogFiles } from '../controllers/configController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .all(
    checkMaintenance
  )
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
    checkMaintenance,
    passportJWT,
    readLog
  )

router.route('/getlogfiles')
  .get(
    checkMaintenance,
    passportJWT,
    getLogFiles
  )

export default router