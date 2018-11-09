import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionRights } from '../_helpers/checkPermission'
import clientRepo from '../models/clientModel'
import userRepo from '../models/userModel'

const ministraAPI = process.env.MINISTRA_HOST+'stalker_portal/api/'
const ministaUser = process.env.MINISTRA_USER
const ministraPW = process.env.MINISTRA_PW
const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  auth: {
    username: `${ministaUser}`,
    password: `${ministraPW}`
  }
}

export async function validateMAC(req, res, next) {
  await axios.get(ministraAPI+'accounts/'+req.params.id, config)
    .then(response => {
      res.locals.client = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.client.status!=='OK') return res.status(404).json({ error: `client with mac Address ${req.params.id} was not found in the ministra system`})
  const client = await clientRepo.findOne({ clientMac : req.params.id})
  if (!client) return res.status(404).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` }) 
  res.locals.mongoClient = client
  if(await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  next()
}

export async function checkMac(req, res, next) {
  const client = await clientRepo.findOne({ clientMac : req.params.id})
  if (!client) return res.status(200).json({ mac: req.params.id, status: "Available." }) 
  return res.status(201).json(client)
}

export async function addClient(req, res, next) {
  if(req.user.userType !== 'reseller') return res.status(403).json({error: `You have no rights to add this client.`})
  const { stb_mac } = req.value.body
  const ministraPayLoad = querystring.stringify(req.value.body)
  await axios.post(ministraAPI+'accounts/',
  ministraPayLoad, config)
    .then(response => {
      res.locals.addedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.addedUser.status!=='OK') {
    return res.status(404).json({ error: `Failed to add a client to the system : ${res.locals.addedUser.error}`})
  }
  else {
    const clientMac = stb_mac
    const parentUser = req.user.username
    const expiryDate = req.value.body.tariff_expired_date
    const client = await clientRepo.create([{clientMac, parentUser, expiryDate}], {lean:true})
    await userRepo.findOneAndUpdate({username : parentUser},{ $push: { childUsernames : clientMac} } )
    await res.status(201).json({client})
  }
}

export async function updateClient(req, res, next) {
  await axios.put(ministraAPI+'accounts/'+req.params.id,
  querystring.stringify(req.value.body), config)
    .then(response => {
      res.locals.updatedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.updatedUser.status!=='OK') {
    return res.status(404).json({ error: `Failed to update the client ${req.params.id} to the system : ${res.locals.updatedUser.error}`})
  }
  else if (req.value.body.tariff_expired_date !== undefined) {
    await res.locals.mongoClient.update({expiryDate : req.value.body.tariff_expired_date})
  }
  return res.status(200).json(req.params.id)
}

export async function deleteClient(req, res, next) {
  await axios.delete(ministraAPI+'accounts/'+req.params.id, config)
    .then(response => {
      res.locals.deletingClient = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.deletingClient.status!=='OK') {
    return res.status(404).json({ error: `failed to delete client ${req.params.id} : ${res.locals.deletingClient.error}`})
  }
  else {
    await userRepo.findOneAndUpdate({username : res.locals.mongoClient.parentUser},{ $pull: { childUsernames : res.locals.mongoClient.clientMac} } )
    await res.locals.mongoClient.remove()
    return res.status(200).json(req.params.id)
  }
}