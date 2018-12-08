import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/clientValidation'
import { addClient, validateMAC, updateClient, deleteClient, checkMac, reActivate } from '../controllers/clientController'


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
    deleteClient
  )

router.route('/reactivate/:id')
  .put(
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    reActivate
  )

router.route('/checkmac/:id')
  .get(
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    checkMac
  )

export default router