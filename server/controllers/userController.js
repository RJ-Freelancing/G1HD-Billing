import userRepo from '../models/userModel'
import axios from 'axios'
import JWT from 'jsonwebtoken'

const ministraAPI = process.env.MINISTRA_HOST+'stalker_portal/api/'
const ministaUser = process.env.MINISTRA_USER
const ministraPW = process.env.MINISTRA_PW

const getToken = user => {
  return JWT.sign({
    iss: 'Budget',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, process.env.JWT_SECRET)
}

export async function validateID(req, res, next) {
  const user = await userRepo.findById(req.params.id)
  if (!user) return res.status(404).json({ error: `User with id ${req.params.id} was not found in DB` }) 
  res.locals.user = user
  next()
}

export async function getAllUsers(req, res, next) {
  const users = await userRepo.find({}, null, { sort: { firstName: 1 } })
  res.status(200).json(users)
}

export async function addUser(req, res, next) {
  const { username, email, password, passwordConfirmation, firstName, lastName, phoneNo, userTypeID, accountStatus, joinedDate, parentID, creditsAvailable, creditsOnHold } = req.value.body
  const existingUser = await userRepo.findOne({ username })
  if (existingUser) 
    return res.status(401).json({ error: `User already exists with username: ${username}` })
  if (password !== passwordConfirmation)
    return res.status(403).json({ error: `Password and PasswordConfirmation do not match` })
  const user = await userRepo.create([{username, email, password, firstName, lastName, phoneNo, userTypeID, accountStatus, joinedDate, parentID, creditsAvailable, creditsOnHold}], {lean:true})
  const token = getToken(user)
  res.status(201).json({ user, token })
}

export async function login(req, res, next) {
  const { user } = req
  const token = getToken(user)
  res.status(201).json({ user, token })
}

export async function getUser(req, res, next) {
  res.status(200).json(res.locals.user)
}

export async function updateUser(req, res, next) {
  await res.locals.user.update(req.value.body)
  return res.status(200).json({...res.locals.user._doc, ...req.value.body})
}

export async function deleteUser(req, res, next) {
  const username = res.locals.user.username
  await res.locals.user.remove()
  return res.status(200).json(`User with username: ${username} successfully deleted.`)
}