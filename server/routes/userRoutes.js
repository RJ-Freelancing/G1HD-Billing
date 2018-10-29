import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { getAllUsers, addUser, validateUsername, getUser, updateUser, deleteUser } from '../controllers/userController'

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllUsers
  )
  .post(
    validateBody(schemas.addSchema),
    addUser
  )

router.route('/:username')
  .all(
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