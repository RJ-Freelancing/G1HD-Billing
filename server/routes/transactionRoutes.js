import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/transactionValidation'
import { checkMaintenance } from '../_helpers/checkMaintenance'
import { addTransaction, checkPermission, getTransactionsForUser } from '../controllers/transactionController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

router.route('/')
  .post(
    checkMaintenance,
    passportJWT,
    validateBody(schemas.addSchema),
    addTransaction
  )

router.route('/:id')
  .get(
    checkMaintenance,
    passportJWT,
    checkPermission,
    getTransactionsForUser
  )

export default router