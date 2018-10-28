import userRepo from '../models/userModel'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
  if(req.user.userType == "reseller" || !req.user.childUsernames.includes(req.params.username)) return res.status(403).json({error: `You have no rights to perform this action.`})
  res.locals.user = user
  next()
}

export async function getAllUsers(req, res, next) {
  if (req.user.userType == "reseller") return res.status(403).json({error: `You have no rights to perform this action.`})
  var admins = []
  var superResellers = []
  var resellers = []
  if (req.user.userType == "super-admin") {
    var childAdmins = req.user.childUsernames
    var childSuperResellers = []
    var childResellers = []
    admins = await userRepo.find({username: { $in: childAdmins}}, null, { sort: { firstName: 1 } })
    for(var i = 0; i < admins.length; i++){
      childSuperResellers = [...childSuperResellers, ...admins[i].childUsernames] 
    }
    superResellers = await userRepo.find({username: { $in: childSuperResellers}}, null, { sort: { firstName: 1 } })
    for(var i = 0; i < superResellers.length; i++){ 
      childResellers = [...childResellers, ...superResellers[i].childUsernames] 
    }
    resellers = await userRepo.find({username: { $in: childResellers}}, null, { sort: { firstName: 1 } })
  }
  if (req.user.userType == "admin") {
    var childSuperResellers = req.user.childUsernames
    var childResellers = []
    superResellers = await userRepo.find({username: { $in: childSuperResellers}}, null, { sort: { firstName: 1 } })
    for(var i = 0; i < superResellers.length; i++){ 
      childResellers = [...childResellers, ...superResellers[i].childUsernames] 
    }
    resellers = await userRepo.find({username: { $in: childResellers}}, null, { sort: { firstName: 1 } })
  }
  if (req.user.userType == "super-reseller") {
    var childResellers = req.user.childUsernames
    resellers = await userRepo.find({username: { $in: childResellers}}, null, { sort: { firstName: 1 } })
  }
  res.status(201).json({admins, superResellers, resellers})
}

export async function addUser(req, res, next) {
  const { username, email, password, passwordConfirmation, firstName, lastName, phoneNo, userType, accountStatus, joinedDate, parentUsername, creditsAvailable, creditsOnHold } = req.value.body
  if (req.user.userType == "reseller") return res.status(403).json({error: `You have no rights to perform this action.`})
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
  const username = res.locals.user.username
  await res.locals.user.remove()
  return res.status(200).json(`User with username: ${username} successfully deleted.`)
}

export async function getChildren(req, res, next) {
  const users = await userRepo.find({username: { $in: res.locals.user.childUsernames}}, null, { sort: { firstName: 1 } })
  res.status(200).json(users)
}