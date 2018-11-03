import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { addClient, validateMAC, updateClient, deleteClient } from '../controllers/clientController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

  router.route('/')
  .post(
    passportJWT,
    validateBody(schemas.addSchema),
    addClient
  )

router.route('/:id')
  .all(
    passportJWT,
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