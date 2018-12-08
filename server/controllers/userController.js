import userRepo from '../models/userModel'
import clientRepo from '../models/clientModel'
import userLoginsRepo from '../models/userLoginsModel'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { getAllClients, getClients } from '../_helpers/ministraHelper'
import { checkPermissionRights, validParent } from '../_helpers/checkPermission'
import { winstonLogger } from '../_helpers/logger'
 
const tokenExpiryHours = process.env.TOKEN_EXPIRY_HOURS

export async function login(req, res, next) {
  console.log(req);
  
  winstonLogger.info("Running Operation login...")
  const user = req.user
  const lastLogin = await userLoginsRepo.findOne({ username : user.username }).sort({ loginDate : -1 }).limit(1)
  if (user.accountStatus == false) return res.status(403).json({ error: `Your account is locked. Please contact your Adminstrator for more information.` })
  const token = getToken(user)
  
  res.status(201).json({ user, token })
}

async function postLoginDetails(req)  {
  winstonLogger.info("Get login details...")
  const loginUserAgent = req.get('User-Agent')
  const lastLoginDate = new Date()
  const loginIp = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
const currLogin = await userLoginsRepo.create([{ username, loginUserAgent, lastLoginDate, loginIp }], { lean: true })
}

const getToken = user => {
  winstonLogger.info("Running Operation getToken...")
  return JWT.sign({
    iss: 'G1HD',
    sub: user.id,
    iat: new Date().getTime(),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * tokenExpiryHours) // Set to 30 days for development mode in .env
  }, process.env.JWT_SECRET)
}

export async function validateUsername(req, res, next) {
  winstonLogger.info("Running Operation validateUsername...")
  const user = await userRepo.findOne({ username: req.params.username })
  if (!user) return res.status(404).json({ error: `User with username ${req.params.username} was not found in DB` })
  res.locals.user = user
  if (await checkPermissionRights(user, req.user, 1) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  next()
}

export async function getAllUsers(req, res, next) {
  winstonLogger.info("Running Operation getAllUsers...")
  let admins = []
  let superResellers = []
  let resellers = []
  let clients = []
  if (req.user.userType == "superAdmin") {
    admins = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    superResellers = await getChildren(admins, 0)
    resellers = await getChildren(superResellers, 0)
    clients = (await getChildren(resellers, 2)).sort((a, b) => new Date(a.tariff_expired_date) - new Date(b.tariff_expired_date))
  }
  if (req.user.userType == "admin") {
    superResellers = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    resellers = await getChildren(superResellers, 0)
    clients = (await getChildren(resellers, 1)).sort((a, b) => new Date(a.tariff_expired_date) - new Date(b.tariff_expired_date))
  }
  if (req.user.userType == "superReseller") {
    resellers = await userRepo.find({ username: { $in: req.user.childUsernames } }, null, { sort: { creditsAvailable: 1 } })
    clients = (await getChildren(resellers, 1)).sort((a, b) => new Date(a.tariff_expired_date) - new Date(b.tariff_expired_date))
  }
  if (req.user.userType == "reseller") {
    clients = (await getChildren(req.user.childUsernames, 3)).sort((a, b) => new Date(a.tariff_expired_date) - new Date(b.tariff_expired_date))
  }
  return res.status(200).json({ admins, superResellers, resellers, clients })
}

export async function addUser(req, res, next) {
  winstonLogger.info("Running Operation addUser...")
  const { username, email, password, firstName, lastName, phoneNo, userType, accountStatus, creditsAvailable, creditsOwed } = req.value.body
  const parentUsername = req.user.username
  if (await validParent(req.user.userType, userType, res.locals.user) == false) return res.status(403).json({ error: `You have no rights to add this user.` })
  const existingUser = await userRepo.findOne({ username })
  if (existingUser)
    return res.status(422).json({ error: `User already exists with username: ${username}` })
  const createdUser = await userRepo.create([{ username, email, password, firstName, lastName, phoneNo, userType, accountStatus, parentUsername, creditsAvailable, creditsOwed }], { lean: true })
  if (!req.user.childUsernames.includes(username)) {
    await req.user.update({ $push: { childUsernames: username.toLowerCase() } })
  }
  const token = getToken(createdUser)
  const user = createdUser[0]
  return res.status(201).json({ user, token })
}

export async function getUser(req, res, next) {
  winstonLogger.info("Running Operation getUser...")
  return res.status(200).json(res.locals.user)
}

export async function updateUser(req, res, next) {
  winstonLogger.info("Running Operation updateUser...")
  if (req.body.password !== undefined) {
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
  }
  await res.locals.user.update(req.body)
  return res.status(200).json({ ...res.locals.user._doc, ...req.value.body })
}

export async function deleteUser(req, res, next) {
  winstonLogger.info("Running Operation deleteUser...")
  if (req.user.userType == "reseller") return res.status(403).json({ error: `Only your superReseller/admin can delete your account.` })
  if (res.locals.user.childUsernames.length !== 0) return res.status(422).json({ error: `The user ${res.locals.user.username} has childs. Please remove/switch childs before you delete this user.`})
  const username = res.locals.user.username
  await userRepo.findOneAndUpdate({ username: res.locals.user.parentUsername }, { $pull: { childUsernames: username } })
  await res.locals.user.remove()
  return res.status(200).json(`User with username: ${username} successfully deleted.`)
}

export async function upgradeUserRole(req, res, next) {
  winstonLogger.info("Running Operation upgradeUserRole...")
  const { username, userType, password } = req.value.body
  const { email, firstName, lastName, phoneNo, accountStatus, upgradedAccount } = res.locals.user
  const parentUsername = req.user.username
  if (await validParent(req.user.userType, userType, res.locals.user) == false) return res.status(403).json({ error: `You have no rights to add this user.` })
  if(upgradedAccount == true) return res.status(422).json({ error: `This user already has been upgraded to ${userType}.` })
  const existingUser = await userRepo.findOne({ username })
  if (existingUser)
    return res.status(422).json({ error: `User already exists with username: ${username}` })
  const newlyUpgradedUser = await userRepo.create([{ username, email, password, firstName, lastName, phoneNo, userType, accountStatus, parentUsername, childUsernames : req.params.username }], { lean: true })
  if (!req.user.childUsernames.includes(username)) {
    await req.user.update({ $push: { childUsernames: username.toLowerCase() }})
  }
  const oldParentUsername = res.locals.user.parentUsername
  await res.locals.user.update({parentUsername : req.value.body.username, upgradedAccount : true})
  var oldParent = await userRepo.findOne({ username: oldParentUsername })
  await oldParent.update({ $pull: { childUsernames: req.params.username } })
  return res.status(200).json(newlyUpgradedUser)
}

async function getChildren(list, isMinistra) {
  winstonLogger.info("Running Operation getChildren...")
  // given a list of parentObjects, return all direct childObjects of each parent
  const childUsernames = [].concat(...list.map(parent => parent.childUsernames))
  if (isMinistra == 0) {
    return await userRepo.find({ username: { $in: childUsernames } }, null, { sort: { creditsAvailable: 1 } })
  }
  else if (isMinistra == 1) {
    const macAdresses = await (childUsernames.length == 0 ? [''] : childUsernames)
    const ministraClients = await getClients(macAdresses)
    const mongoClients = await clientRepo.find({ clientMac: { $in: macAdresses } })
    return mergeArrayObjectsByKey(mongoClients, ministraClients, 'clientMac', 'stb_mac')
  }
  else if (isMinistra == 2) {
    const ministraClients = await getAllClients()
    const mongoClients = await clientRepo.find({})
    return mergeArrayObjectsByKey(mongoClients, ministraClients, 'clientMac', 'stb_mac')
  }
  else {
    const macAdresses = await (list.length == 0 ? "1" : list)
    const ministraClients = await getClients(macAdresses)
    const mongoClients = await clientRepo.find({ clientMac: { $in: macAdresses } })
    return mergeArrayObjectsByKey(mongoClients, ministraClients, 'clientMac', 'stb_mac')
  }
}

export function mergeArrayObjectsByKey(obj1Array, obj2Array, key1, key2) {
  winstonLogger.info("Running Operation mergeArrayObjectsByKey...")
  return obj1Array.map(obj1=>({...obj1._doc, ...(obj2Array.find(obj2=>obj2[key2]==obj1[key1]))}))
}