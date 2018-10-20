import Example from '../models/clientModel'


export async function checkPermission(req, res, next) {
  const example = await Example.findById(req.params.id)
  if (!example) return res.status(404).json({ error: `Example with id ${req.params.id} was not found` }) 
  // Can perform checks if current logged in user has required permissions
  if (example.userID!==req.user.id) {
    return res.status(401).json({ error: `You don't have permission to access this Example` })
  }
  res.locals.example = example
  next()
}

export async function getAllClients(req, res, next) {
  res.status(200).json({})
}
export async function addClient(req, res, next) {
  res.status(200).json({})
}
export async function getClient(req, res, next) {
  res.status(200).json({})
}
export async function updateClient(req, res, next) {
  res.status(200).json({})
}
export async function deleteClient(req, res, next) {
  res.status(200).json({})
}
