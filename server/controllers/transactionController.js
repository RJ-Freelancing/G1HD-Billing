import transactionRepo from '../models/transactionModel'

export async function validateId(req, res, next) {
  const transaction = await transactionRepo.findById(req.params.id)
  if (!transaction) return res.status(404).json({ error: `Transaction with transactionId ${req.params.id} was not found in DB` }) 
  next()
}

export async function getTransaction(req, res, next) {
  return []
}

export async function getAllTransactions(req, res, next) {
  return []
}

export async function addTransaction(req, res, next) {
  return []
}