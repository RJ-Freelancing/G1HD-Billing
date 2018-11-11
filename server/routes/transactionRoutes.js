import passport from '../_helpers/passport'
import { validateBody } from '../validations'
import { schemas } from '../validations/transactionValidation'
import { addTransaction, checkPermission, getTransactionsForUser } from '../controllers/transactionController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

  router.route('/')
  .post(
    passportJWT,
    validateBody(schemas.addSchema),
    addTransaction
  )

router.route('/:id')
  .get(
    passportJWT,
    checkPermission,
    getTransactionsForUser
  )

export default router