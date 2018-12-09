import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { login, getLastLogins } from '../controllers/userController'

const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/login')
  .post(
    validateBody(schemas.userLoginSchema),
    passportSignIn,
    login
  )

router.route('/refreshtoken')
  .get(
    passportJWT,
    login
  )

router.route('/logindetails')
  .get(
    passportJWT,
    getLastLogins
  )

export default router