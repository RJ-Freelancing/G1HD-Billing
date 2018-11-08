import passport from '../_helpers/passport'
import { getTariffs, sendMsg, sendEvent } from '../controllers/ministraController'
import { validateBody } from '../validations'
import { schemas } from '../validations/ministraValidation'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

    router.route('/tariffs')
    .get(
      passportJWT,
      getTariffs
    )

    router.route('/stb_msg/')
    .post(
      passportJWT,
      validateBody(schemas.msgSchema),
      sendMsg
    )

    router.route('/send_event/')
    .post(
      passportJWT,
      validateBody(schemas.eventSchema),
      sendEvent
    )

export default router