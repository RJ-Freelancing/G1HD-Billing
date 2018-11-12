import userRepo from '../models/userModel'
import clientRepo from '../models/clientModel'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getAllClients, getClients } from '../_helpers/ministraHelper'
import { checkPermissionRights, validParent } from '../_helpers/checkPermission'

const tokenExpiryHours = process.env.TOKEN_EXPIRY_HOURS

export async function login(req, res, next) {
  const { user } = req
  if (user.accountStatus == false) return res.status(403).json({ error: `Your account is locked. Please contact your Adminstrator for more information.` })
  const token = getToken(user)
  res.status(201).json({ user, token })
}

const getToken = user => {
  return JWT.sign({
    iss: 'G1HD',
    sub: user.id,
    iat: new Date().getTime(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * tokenExpiryHours) // Set to 30 days for development mode in .env
  }, process.env.JWT_SECRET)
}

export async function validateUsername(req, res, next) {
  const user = await userRepo.findOne({ username: req.params.username })
  if (!user) return res.status(404).json({ error: `User with username ${req.params.username} was not found in DB` })
  res.locals.user = user
  if (await checkPermissionRights(user, req.user, 1) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  next()
}

export async function getAllUsers(req, res, next) {
  let admins = []
  let superResellers = []
  let resellers = []
  let clients = []
  if (req.user.userType == "super-admin") {
    admins = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    superResellers = await getChildren(admins, 0)
    resellers = await getChildren(superResellers, 0)
    clients = await getChildren(resellers, 2)
  }
  if (req.user.userType == "admin") {
    superResellers = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    resellers = await getChildren(superResellers, 0)
    clients = await getChildren(resellers, 1)
  }
  if (req.user.userType == "super-reseller") {
    resellers = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    clients = await getChildren(resellers, 1)
  }
  if (req.user.userType == "reseller") {
    clients = await getChildren(req.user.childUsernames, 3)
  }
  return res.status(200).json({ admins, superResellers, resellers, clients })
}

export async function addUser(req, res, next) {
  const { username, email, password, firstName, lastName, phoneNo, userType, accountStatus, creditsAvailable, creditsOnHold } = req.value.body
  const parentUsername = req.user.username
  if (await validParent(req.user.userType, userType, res.locals.user) == false) return res.status(403).json({ error: `You have no rights to add this user.` })
  const existingUser = await userRepo.findOne({ username })
  if (existingUser)
    return res.status(401).json({ error: `User already exists with username: ${username}` })
  const user = await userRepo.create([{ username, email, password, firstName, lastName, phoneNo, userType, accountStatus, parentUsername, creditsAvailable, creditsOnHold }], { lean: true })
  if (!req.user.childUsernames.includes(username)) {
    await req.user.update({ $push: { childUsernames: username.toLowerCase() } })
  }
  const token = getToken(user)
  return res.status(201).json({ user, token })
}

export async function getUser(req, res, next) {
  return res.status(200).json(res.locals.user)
}

export async function updateUser(req, res, next) {
  if (req.body.password !== undefined) {
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
  }
  await res.locals.user.update(req.body)
  return res.status(200).json({ ...res.locals.user._doc, ...req.value.body })
}

export async function deleteUser(req, res, next) {
  if (req.user.userType == "reseller") return res.status(403).json({ error: `Only your superReseller/admin can delete your account.` })
  if (res.locals.user.childUsernames.length !== 0) return res.status(404).json({ error: `The user ${res.locals.user.username} has childs. Please remove/switch childs before you delete this user.`})
  const username = res.locals.user.username
  await userRepo.findOneAndUpdate({ username: res.locals.user.parentUsername }, { $pull: { childUsernames: username } })
  await res.locals.user.remove()
  return res.status(200).json(`User with username: ${username} successfully deleted.`)
}

export async function upgradeUserRole(req, res, next) {
  const { username, userType } = req.value.body
  const { email, password, firstName, lastName, phoneNo, accountStatus } = res.locals.user
  const parentUsername = req.user.username
  if (await validParent(req.user.userType, userType, res.locals.user) == false) return res.status(403).json({ error: `You have no rights to add this user.` })
  const existingUser = await userRepo.findOne({ username })
  if (existingUser)
    return res.status(401).json({ error: `User already exists with username: ${username}` })
  await userRepo.create([{ username, email, password, firstName, lastName, phoneNo, userType, accountStatus, parentUsername, childUsernames : req.params.username }], { lean: true })
  if (!req.user.childUsernames.includes(username)) {
    await req.user.update({ $push: { childUsernames: username.toLowerCase() }})
  }
  const oldParentUsername = res.locals.user.parentUsername
  await res.locals.user.update({parentUsername : req.value.body.username})
  var oldParent = await userRepo.findOne({ username: oldParentUsername })
  await oldParent.update({ $pull: { childUsernames: req.params.username } })
  return res.status(200).json(`User  ${req.params.username } has been successfully upgraded to ${username}.`)
}

async function getChildren(list, isMinistra) {
  // given a list of parentObjects, return all direct childObjects of each parent
  const childUsernames = [].concat(...list.map(parent => parent.childUsernames))
  if (isMinistra == 0) {
    return await userRepo.find({ username: { $in: childUsernames } }, null, { sort: { creditsAvailable: 1 } })
  }
  else if (isMinistra == 1) {
    const macAdresses = await (childUsernames.length == 0 ? "1" : childUsernames)
    const ministraClients = await getClients(macAdresses)
    const mongoClients = await clientRepo.find({ clientMac: { $in: macAdresses } })
    return mergeArrayObjectsByKey(ministraClients, mongoClients, 'stb_mac', 'clientMac')
  }
  else if (isMinistra == 2) {
    const ministraClients = await getAllClients()
    const mongoClients = await clientRepo.find({})
    return mergeArrayObjectsByKey(ministraClients, mongoClients, 'stb_mac', 'clientMac')
  }
  else {
    const macAdresses = await (list.length == 0 ? "1" : list)
    const ministraClients = await getClients(macAdresses)
    const mongoClients = await clientRepo.find({ clientMac: { $in: macAdresses } })
    return mergeArrayObjectsByKey(ministraClients, mongoClients, 'stb_mac', 'clientMac')
  }
}

function mergeArrayObjectsByKey(obj1Array, obj2Array, key1, key2) {
  return obj1Array.map(obj1 => {
    const mongoClient = obj2Array.find(obj2 => obj2._doc[key2] == obj1[key1])
    if (mongoClient)
      return { ...obj1, ...mongoClient._doc }
    else
      return obj1
  })
}