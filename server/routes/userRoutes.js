import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/userValidation'
import { getAllUsers, addUser, validateID, getUser, updateUser, deleteUser, getChildren } from '../controllers/userController'

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
    deleteUser
  )

  router.route('/:id/children')
  .get(
    validateParam(schemas.idSchema, 'id'),
    validateID,
    getChildren
  )

export default router