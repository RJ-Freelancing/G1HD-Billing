import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { getAllClients, addClient, validateID, getClient, updateClient, deleteClient, getChildren } from '../controllers/clientController'

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllClients
  )
  .post(
    validateBody(schemas.addSchema),
    addClient
  )

router.route('/:id')
  .all(
    validateParam(schemas.idSchema, 'id'),
    validateID
  )
  .get(
    getClient
  )
  .patch(
    validateBody(schemas.updateSchema),
    updateClient
  )
  .delete(
    deleteClient
  )

  router.route('/:id/children')
  .get(
    validateParam(schemas.idSchema, 'id'),
    validateID,
    getChildren
  )

export default router