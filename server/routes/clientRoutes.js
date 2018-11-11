import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { addClient, validateMAC, updateClient, deleteClient, checkMac } from '../controllers/clientController'


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
    validateParam(schemas.idSchema, 'id')
  )
  .put(
    validateMAC,
    validateBody(schemas.updateSchema),
    updateClient
  )
  .delete(
    // validateMAC - No need as a rare case the mac might be there in ministra but not in local mongo
    deleteClient
  )

  router.route('/checkmac/:id')
  .get(
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    checkMac
  )

export default router