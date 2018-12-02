import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionRights } from '../_helpers/checkPermission'
import clientRepo from '../models/clientModel'
import userRepo from '../models/userModel'
import { winstonLogger } from '../_helpers/logger'
import transactionRepo from '../models/transactionModel'
import { mergeArrayObjectsByKey } from '../controllers/userController'

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
  winstonLogger.info("Running validateMAC Operation.")
  await axios.get(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      res.locals.client = response.data
    })
  if (res.locals.client.status !== 'OK') return res.status(422).json({ error: `client with mac Address ${req.params.id} was not found in the ministra system` })
  const client = await clientRepo.findOne({ clientMac: req.params.id })
  if (!client) return res.status(422).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` })
  res.locals.mongoClient = client
  if (await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  next()
}

export async function checkMac(req, res, next) {
  winstonLogger.info("Running checkMac Operation.")
  const existingClient = await clientRepo.findOne({ clientMac: req.params.id })
  if (!existingClient)
    await checkAndDeleteUnwantedClient(req.params.id)
  await axios.get(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      if (response.data.status !== 'OK') return res.status(200).json({ mac: req.params.id, status: "Available." })
      if (new Date(response.data.results[0].tariff_expired_date) < new Date()) return res.status(200).json({ mac: req.params.id, status: "Available." })
      return res.status(200).json({ mac: response.data.results[0].stb_mac, expiryDate: response.data.results[0].tariff_expired_date, status: "Unavailable." })
    })
}

async function checkAndDeleteUnwantedClient(stb_mac){
  winstonLogger.info("Running checkAndDeleteUnwantedClient Operation.")
  await axios.delete(ministraAPI + 'accounts/' + stb_mac, config)
    .then(response => {
      if(response.data.status == 'OK')
        console.log("Fake Client From Ministra Deleted.")
    })
}

export async function addClient(req, res, next) {
  winstonLogger.info("Running addClient Operation.")
  if (req.user.userType !== 'reseller') return res.status(403).json({ error: `Only reseller can add a client.` })
  const { stb_mac } = req.value.body
  const ministraPayLoad = querystring.stringify(req.value.body)
  const existingClient = await clientRepo.findOne({ clientMac: stb_mac })
  if (existingClient) {
    await axios.get(ministraAPI + 'accounts/' + stb_mac, config)
    .then(response => {
      res.locals.existingDeletingClient = response.data
    })
    console.log(new Date());
    if(new Date(res.locals.existingDeletingClient.results[0].tariff_expired_date) < new Date()){
      await checkAndDeleteUnwantedClient(stb_mac)
      await existingClient.remove()
    }
    else {
      return res.status(422).json({ error: `Client already exists with macAddress: ${stb_mac}` })
    }
  }
  await checkAndDeleteUnwantedClient(stb_mac)
  await axios.post(ministraAPI + 'accounts/',
    ministraPayLoad, config)
    .then(response => {
      res.locals.addedUser = response.data
    })
  if (res.locals.addedUser.status !== 'OK') {
    return res.status(422).json({ error: `Failed to add a client to the system : ${res.locals.addedUser.error}` })
  }
  else {
    const clientMac = stb_mac
    await axios.get(ministraAPI + 'accounts/' + clientMac, config)
    .then(response => {
      res.locals.newClient = response.data
    })
    const newMinistraClient = res.locals.newClient.results
    const parentUsername = req.user.username
    const client = await clientRepo.create([{ clientMac, parentUsername }], { lean: true })
    await userRepo.findOneAndUpdate({ username: parentUsername }, { $push: { childUsernames: clientMac } })
    await res.status(201).json(mergeArrayObjectsByKey(client, newMinistraClient, 'clientMac', 'stb_mac')[0])
  }
}

export async function updateClient(req, res, next) {
  winstonLogger.info("Running updateClient Operation.")
  var returnMac = req.params.id
  if (req.value.body.stb_mac !== undefined) {
    returnMac = req.value.body.stb_mac
    if (returnMac == req.params.id) return res.status(400).json("No change in Mac Address.")
    const existingClient = await clientRepo.findOne({ clientMac: returnMac })
    if (existingClient) {
      await axios.get(ministraAPI + 'accounts/' + returnMac, config)
      .then(response => {
        res.locals.existingDeletingUPClient = response.data
      })
      if(new Date(res.locals.existingDeletingUPClient.results[0].tariff_expired_date) < new Date()){
        await checkAndDeleteUnwantedClient(returnMac)
        await existingClient.remove()
      }
      else {
        return res.status(422).json({ error: `Client already exists with macAddress: ${returnMac}` })
      }
    }
    await checkAndDeleteUnwantedClient(returnMac)
    await axios.get(ministraAPI + 'accounts/' + returnMac, config)
      .then(response => {
        if (response.data.status == 'OK') return res.status(422).json("Mac Already Exists on the System. Please delete that mac before proceeding")
      })
    await res.locals.mongoClient.update({ clientMac: returnMac })
    await userRepo.findOneAndUpdate({ username: res.locals.mongoClient.parentUsername }, { $push: { childUsernames: returnMac } })
    await userRepo.findOneAndUpdate({ username: res.locals.mongoClient.parentUsername }, { $pull: { childUsernames: req.params.id } })
    await transactionRepo.update({ transactionTo : req.params.id }, { transactionTo : returnMac }, {multi: true})
  }
  await axios.put(ministraAPI + 'accounts/' + req.params.id,
    querystring.stringify(req.value.body), config)
    .then(response => {
      res.locals.updatedUser = response.data
    })
  if (res.locals.updatedUser.status !== 'OK') {
    return res.status(404).json({ error: `Failed to update the client ${req.params.id} to the system : ${res.locals.updatedUser.error}` })
  }
  return res.status(200).json(returnMac)
}

export async function deleteClient(req, res, next) {
  winstonLogger.info("Running deleteClient Operation.")
  if (await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const client = await clientRepo.findOne({ clientMac: req.params.id })
  if (!client) return res.status(422).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` })
  if (client.accountBalance > 0) return res.status(400).json({ error: `The Client has ${client.accountBalance} credits in his account. Please recover the credits from this Client ${req.params.id} before you delete.` })
  await axios.delete(ministraAPI + 'accounts/' + req.params.id, config)
    .then(response => {
      res.locals.deletingClient = response.data
    })
  if (res.locals.deletingClient.status !== 'OK') {
    return res.status(422).json({ error: `failed to delete client ${req.params.id} : ${res.locals.deletingClient.error}` })
  }
  else {
    await userRepo.findOneAndUpdate({ username: client.parentUsername }, { $pull: { childUsernames: client.clientMac } })
    await client.remove()
    return res.status(200).json(req.params.id)
  }
}