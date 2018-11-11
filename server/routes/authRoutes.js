import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { login } from '../controllers/userController'

const passportSignIn = passport.authenticate('local', { session: false })

const router = require('express-promise-router')()

router.route('/login')
  .post(
    validateBody(schemas.userLoginSchema),
    passportSignIn,
    login
  )

export default router