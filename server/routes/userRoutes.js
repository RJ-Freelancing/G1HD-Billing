import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { register, login, remove } from '../controllers/userController'


const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

const router = require('express-promise-router')()

router.route('/register')
  .post(
    validateBody(schemas.userRegisterSchema),
    register
  )

router.route('/login')
  .post(
    validateBody(schemas.userLoginSchema),
    passportSignIn,
    login
  )

router.route('/delete')
  .delete(
    passportJWT,
    remove
  )


export default router