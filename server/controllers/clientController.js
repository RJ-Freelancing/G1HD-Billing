import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionRights } from '../_helpers/checkPermission'
import clientRepo from '../models/clientModel'
import userRepo from '../models/userModel'

const ministraAPI = process.env.MINISTRA_HOST + 'stalker_portal/api/'
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
  await axios.get(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      res.locals.client = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.client.status !== 'OK') return res.status(404).json({ error: `client with mac Address ${req.params.id} was not found in the ministra system` })
  const client = await clientRepo.findOne({ clientMac: req.params.id })
  if (!client) return res.status(404).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` })
  res.locals.mongoClient = client
  if (await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  next()
}

export async function checkMac(req, res, next) {
  await axios.get(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      if (response.data.status !== 'OK') return res.status(200).json({ mac: req.params.id, status: "Available." })
      return res.status(200).json({ mac: response.data.results[0].stb_mac, expiryDate: response.data.results[0].tariff_expired_date, status: "Unavailable." })
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

export async function addClient(req, res, next) {
  if (req.user.userType !== 'reseller') return res.status(403).json({ error: `You have no rights to add this client.` })
  const { stb_mac } = req.value.body
  const ministraPayLoad = querystring.stringify(req.value.body)
  await axios.post(ministraAPI + 'accounts/',
    ministraPayLoad, config)
    .then(response => {
      res.locals.addedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.addedUser.status !== 'OK') {
    return res.status(404).json({ error: `Failed to add a client to the system : ${res.locals.addedUser.error}` })
  }
  else {
    const clientMac = stb_mac
    const parentUsername = req.user.username
    const client = await clientRepo.create([{ clientMac, parentUsername }], { lean: true })
    await userRepo.findOneAndUpdate({ username: parentUsername }, { $push: { childUsernames: clientMac } })
    await res.status(201).json({ client })
  }
}

export async function updateClient(req, res, next) {
  var returnMac = req.params.id
  if (req.value.body.stb_mac !== undefined) {
    returnMac = req.value.body.stb_mac
    if (returnMac == req.params.id) return res.status(400).json("No change in Mac Address.")
    await axios.get(ministraAPI + 'accounts/' + returnMac, config)
      .then(response => {
        if (response.data.status == 'OK') return res.status(400).json("Mac Already Exists on the System. Please delete that mac before proceeding")
      })
      .catch(error => {
        console.log("Ministra API Error : " + error)
      })
    await res.locals.mongoClient.update({ clientMac: returnMac })
    await userRepo.findOneAndUpdate({ username: res.locals.mongoClient.parentUsername }, { $push: { childUsernames: returnMac } })
    await userRepo.findOneAndUpdate({ username: res.locals.mongoClient.parentUsername }, { $pull: { childUsernames: req.params.id } })

  }
  await axios.put(ministraAPI + 'accounts/' + req.params.id,
    querystring.stringify(req.value.body), config)
    .then(response => {
      res.locals.updatedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.updatedUser.status !== 'OK') {
    return res.status(404).json({ error: `Failed to update the client ${req.params.id} to the system : ${res.locals.updatedUser.error}` })
  }
  return res.status(200).json(returnMac)
}

export async function deleteClient(req, res, next) {
  if (await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const client = await clientRepo.findOne({ clientMac: req.params.id })
  if (!client) return res.status(404).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` })
  await axios.delete(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      res.locals.deletingClient = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.deletingClient.status !== 'OK') {
    return res.status(404).json({ error: `failed to delete client ${req.params.id} : ${res.locals.deletingClient.error}` })
  }
  else {
    await userRepo.findOneAndUpdate({ username: client.parentUsername }, { $pull: { childUsernames: client.clientMac } })
    await client.remove()
    return res.status(200).json(req.params.id)
  }
}