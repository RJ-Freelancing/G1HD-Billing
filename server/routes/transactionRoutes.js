import passport from '../_helpers/passport'
import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/transactionValidation'
import { getAllTransactions, addTransaction, checkPermission, getTransactionsForUser } from '../controllers/transactionController'


const passportJWT = passport.authenticate('jwt', { session: false })
const router = require('express-promise-router')()

  router.route('/')
  .all(
    passportJWT
  )
  .get(
    getAllTransactions
  )
  .post(
    validateBody(schemas.addSchema),
    addTransaction
  )

router.route('/:id')
  .get(
    passportJWT,
    validateParam(schemas.idSchema, 'id'),
    checkPermission,
    getTransactionsForUser
  )

export default router