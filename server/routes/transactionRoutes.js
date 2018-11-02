import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/transactionValidation'
import { getAllTransactions, addTransaction, validateId, getTransactionsForUser } from '../controllers/transactionController'

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllTransactions
  )
  .post(
    validateBody(schemas.addSchema),
    addTransaction
  )

router.route('/:id')
  .get(
    validateParam(schemas.idSchema, 'id'),
    validateId,
    getTransactionsForUser
  )

export default router