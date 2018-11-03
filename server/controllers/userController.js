import userRepo from '../models/userModel'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getAllClients, getClients } from '../_helpers/ministraHelper'
import { checkPermissionRights } from '../_helpers/checkPermission'

export async function login(req, res, next) {
  const { user } = req
  const token = getToken(user)
  res.status(201).json({ user, token })
}

const getToken = user => {
  return JWT.sign({
    iss: 'Budget',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, process.env.JWT_SECRET)
}

export async function validateUsername(req, res, next) {
  const user = await userRepo.findOne({ username : req.params.username})
  if (!user) return res.status(404).json({ error: `User with username ${req.params.username} was not found in DB` }) 
  res.locals.user = user
  if(await checkPermissionRights(user, req.user, 1) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  next()
}

export async function getAllUsers(req, res, next) {
  let admins = []
  let superResellers = []
  let resellers = []
  let clients = []
  if (req.user.userType == "super-admin") {
    admins = await userRepo.find({username: { $in: req.user.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
    superResellers = await getChildren(admins, 0)
    resellers = await getChildren(superResellers, 0)
    clients = await getChildren(resellers, 2)
  }
  if (req.user.userType == "admin") {
    superResellers = await userRepo.find({username: { $in: req.user.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
    resellers = await getChildren(superResellers, 0)
    clients = await getChildren(resellers, 1)
  }
  if (req.user.userType == "super-reseller") {
    resellers = await userRepo.find({username: { $in: req.user.childUsernames}}, null, { sort: { creditsAvailable: 1 } })
    clients = await getChildren(resellers, 1)
  }
  if (req.user.userType == "reseller") {
    clients = await getClients(req.user.childUsernames)
  }
  res.status(200).json({admins, superResellers, resellers, clients})
}

export async function addUser(req, res, next) {
  const { username, email, password, passwordConfirmation, firstName, lastName, phoneNo, userType, accountStatus, joinedDate, creditsAvailable, creditsOnHold } = req.value.body
  const parentUsername = req.user.username
  if (await validParent(req.user.userType, userType) == false) return res.status(403).json({error: `You have no rights to add this user.`})
  const existingUser = await userRepo.findOne({ username })
  if (existingUser) 
    return res.status(401).json({ error: `User already exists with username: ${username}` })
  if (password !== passwordConfirmation)
    return res.status(403).json({ error: `Password and PasswordConfirmation do not match` })
  const user = await userRepo.create([{username, email, password, firstName, lastName, phoneNo, userType, accountStatus, joinedDate, parentUsername, creditsAvailable, creditsOnHold}], {lean:true})
  const token = getToken(user)
  res.status(201).json({ user, token })
}

export async function getUser(req, res, next) {
  res.status(200).json(res.locals.user)
}

export async function updateUser(req, res, next) {
  if (req.body.password !== undefined){
    const salt = await bcrypt.genSalt(10)  
    req.body.password = await bcrypt.hash(req.body.password, salt) 
  }
  await res.locals.user.update(req.body)
  return res.status(200).json({...res.locals.user._doc, ...req.value.body})
}

export async function deleteUser(req, res, next) {
  if (req.user.userType == "reseller") return res.status(403).json({error: `Only your super-reseller/admin can delete your account.`})
  const username = res.locals.user.username
  await res.locals.user.remove()
  return res.status(200).json(`User with username: ${username} successfully deleted.`)
}

async function validParent(currentUserType, addingUserType){
  if(currentUserType == 'super-admin' && addingUserType == 'admin') return true
  if(currentUserType == 'admin' && addingUserType == 'super-reseller') return true
  if(currentUserType == 'super-reseller' && addingUserType == 'reseller') return true
  if(currentUserType == 'reseller') return false
  if(addingUserType == 'super-admin') return false
  return false
}

async function getChildren(parents, isMinistra) {
  // given a list of parentObjects, return all direct childObjects of each parent
  const childUsernames = [].concat(...parents.map(parent=>parent.childUsernames))
  if (isMinistra == 0) {
    return await userRepo.find({username: { $in: childUsernames}}, null, { sort: { creditsAvailable: 1 } })
  }
  else if (isMinistra == 1) {
    const macAdresses = await (childUsernames.length == 0 ? "1" : childUsernames)
    const clients = await getClients(macAdresses)
    return await clients
  }
  else {
    const clients = await getAllClients()
    return await clients
  }
}