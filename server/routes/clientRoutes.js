import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { getAllClients, addClient, validateMAC, getClient, updateClient, deleteClient } from '../controllers/clientController'

const router = require('express-promise-router')()

  router.route('/')
  .post(
    validateBody(schemas.addSchema),
    addClient
  )

router.route('/:id')
  .all(
    validateParam(schemas.idSchema, 'id'),
    validateMAC
  )
  .put(
    validateBody(schemas.updateSchema),
    updateClient
  )
  .delete(
    deleteClient
  )

export default router