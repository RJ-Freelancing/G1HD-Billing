import transactionRepo from '../models/transactionModel'

export async function checkPermission(req, res, next) {
  const transactions = await transactionRepo.find({transactionTo: { $in: req.user.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
  if (!transactions) return res.status(404).json({ error: `Transaction with transactionId ${req.params.id} was not found in DB` }) 
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