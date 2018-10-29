import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { getAllClients, addClient, validateMAC, getClient, updateClient, deleteClient } from '../controllers/clientController'

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
    validateMAC
  )
  .get(
    getClient
  )
  .put(
    validateBody(schemas.updateSchema),
    updateClient
  )
  .delete(
    deleteClient
  )

export default router