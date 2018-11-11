import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { getAllUsers, addUser, validateUsername, getUser, updateUser, deleteUser } from '../controllers/userController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .all(
    passportJWT
  )
  .get(
    getAllUsers
  )
  .post(
    validateBody(schemas.addSchema),
    addUser
  )

router.route('/:username')
  .all(
    passportJWT,
    validateParam(schemas.usernameSchema, 'username'),
    validateUsername
  )
  .get(
    getUser
  )
  .patch(
    validateBody(schemas.updateSchema),
    updateUser
  )
  .delete(
    deleteUser
  )

export default router