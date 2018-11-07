import passport from '../_helpers/passport'
import { getTariffs, sendMsg, sendEvent } from '../controllers/ministraController'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/ministraValidation'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

    router.route('/tariffs')
    .get(
      passportJWT,
      getTariffs
    )

    router.route('/stb_msg/:id')
    .post(
      passportJWT,
      validateParam(schemas.idSchema, 'id'),
      validateBody(schemas.msgSchema),
      sendMsg
    )

    router.route('/send_event/:id')
    .post(
      passportJWT,
      validateParam(schemas.idSchema, 'id'),
      validateBody(schemas.eventSchema),
      sendEvent
    )

export default router