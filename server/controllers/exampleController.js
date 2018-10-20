import Example from '../models/exampleModel'


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

export async function list(req, res, next) {
  const examples = await Example.find({userID: req.user.id}, null, { sort: { startDate: 1 } })
  res.status(200).json(examples)
}

export async function create(req, res, next) {
  const { user } = req
  const { name, startDate } = req.value.body
  const duplicateName = await Example.findOne({ name, exampleID: user.id })
  if (duplicateName) return res.status(403).json({ error: `Example already exists with name: ${name}` })
  const example = await Example.create([{name, startDate, userID: user.id}], {lean:true})
  res.status(201).json(example[0])
}

export async function retrieve(req, res, next) {
  return res.status(200).json(res.locals.example)
}

export async function patch(req, res, next) {
  await res.locals.example.update(req.value.body)
  return res.status(200).json({...res.locals.example._doc, ...req.value.body})
}

export async function remove(req, res, next) {
  await res.locals.example.remove()
  return res.status(204).json()
}