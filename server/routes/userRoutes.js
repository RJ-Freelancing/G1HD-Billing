import express from 'express'
import passport from '../config/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { regsiter, login, remove } from '../controllers/userController'


const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })

const router = express.Router()

router.route('/register')
  .post(
    validateBody(schemas.userRegisterSchema),
    regsiter
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