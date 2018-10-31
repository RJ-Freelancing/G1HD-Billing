import { validateParam, validateBody } from '../validations'
import { schemas } from '../validations/transactionValidation'
import { getAllTransactions, addTransaction, validateId, getTransaction } from '../controllers/transactionController'

const router = require('express-promise-router')()

  router.route('/')
  .get(
    getAllTransactions
  )
  .post(
    validateBody(schemas.addSchema),
    addTransaction
  )

router.route('/:transactionId')
  .get(
    validateParam(schemas.idSchema, 'transactionId'),
    validateId,
    getTransaction
  )

export default router