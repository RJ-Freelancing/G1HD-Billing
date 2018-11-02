import transactionRepo from '../models/transactionModel'

export async function validateId(req, res, next) {
  const transaction = await transactionRepo.findById(req.params.id)
  if (!transaction) return res.status(404).json({ error: `Transaction with transactionId ${req.params.id} was not found in DB` }) 
  next()
}

export async function getTransactionsForUser(req, res, next) {
  // All the transactions for a child user/client
  return []
}

export async function getAllTransactions(req, res, next) {
  // All the Transactions for the logged user
  return []
}

export async function addTransaction(req, res, next) {
  // Make Credit Transfer calls here (Ministra and Mongo User along with Transaction)
  return []
}