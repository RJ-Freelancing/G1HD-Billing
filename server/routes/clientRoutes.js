import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { checkMaintenance } from '../_helpers/checkMaintenance'
import { addClient, validateMAC, updateClient, deleteClient, checkMac } from '../controllers/clientController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .post(
    checkMaintenance,
    passportJWT,
    validateBody(schemas.addSchema),
    addClient
  )

router.route('/:id')
  .all(
    checkMaintenance,
    passportJWT,
    validateParam(schemas.idSchema, 'id')
  )
  .put(
    validateMAC,
    validateBody(schemas.updateSchema),
    updateClient
  )
  .delete(
    deleteClient
  )

router.route('/checkmac/:id')
  .get(
    checkMaintenance,
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    checkMac
  )

export default router