import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { getAllUsers, addUser, validateID, getUser, updateUser, deleteUser } from '../controllers/userController'
import passport from '../_helpers/passport'

const passportJWT = passport.authenticate('jwt', { session: false })

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllUsers
  )
  .post(
    validateBody(schemas.addSchema),
    addUser
  )

router.route('/:id')
  .all(
    validateParam(schemas.idSchema, 'id'),
    validateID
  )
  .get(
    getUser
  )
  .patch(
    validateBody(schemas.updateSchema),
    updateUser
  )
  .delete(
    passportJWT,
    deleteUser
  )


export default router