import passport from '../_helpers/passport'
import { getTariffs, sendMsg, sendEvent, getAccountSub, putAccountSub, postAccountSub, deleteAccountSub, permissionCheck } from '../controllers/ministraController'
import { validateBody, validateParam } from '../validations'
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
    permissionCheck,
    sendMsg
  )

router.route('/send_event/')
  .post(
    passportJWT,
    validateBody(schemas.eventSchema),
    permissionCheck,
    sendEvent
  )

router.route('/account_subscription/:id')
  .all(
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    permissionCheck,
  )
  .get(
    getAccountSub
  )
  .post(
    validateBody(schemas.accountSubPostSchema),
    postAccountSub
  )
  .put(
    validateBody(schemas.accountSubPutSchema),
    putAccountSub
  )
  .delete(
    deleteAccountSub
  )

export default router