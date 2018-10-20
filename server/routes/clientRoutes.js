import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { getAllClients, addClient, checkPermission, getClient, updateClient, deleteClient } from '../controllers/clientController'


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
    // checkPermission
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


export default router