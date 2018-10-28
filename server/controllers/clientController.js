import axios from 'axios'
import querystring from 'querystring'

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
  if (res.locals.client.status!=='OK') return res.status(404).json({ error: `client with mac Address ${req.params.id} was not found in the system`})
  // Limiting access only for reseller for now
  if(req.user.userType != "reseller" || !req.user.childUserNames.includes(req.params.id)) return res.status(403).json({error: `You have no rights to perform this action.`})
  next()
}

export async function getAllClients(req, res, next) {
 await axios.get(ministraAPI+'accounts/'+req.user.childUserNames, config)
    .then(response => {
      res.locals.clients = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.clients.status!=='OK') return res.status(404).json({ error: `One or more mac Address are incorrect`})
  res.status(200).json(res.locals.clients.results)
}

export async function addClient(req, res, next) {
  const { stb_mac } = req.value.body
  await axios.get(ministraAPI+'accounts/'+stb_mac, config)
    .then(response => {
      res.locals.existingClient = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.existingClient.status=='OK') return res.status(401).json({ error: `Client already exists with mac Address ${stb_mac} in the system`})
  
  await axios.post(ministraAPI+'accounts/',
  querystring.stringify(req.value.body), config)
    .then(response => {
      res.locals.addedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.addedUser.status!=='OK') return res.status(404).json({ error: `Failed to add a client to the system : ${res.locals.addedUser.error}`})
  res.status(201).json("Client has been sucessfully added to the system.")
}

export async function getClient(req, res, next) {
  res.status(200).json(res.locals.client.results)
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
  if (res.locals.updatedUser.status!=='OK') return res.status(404).json({ error: `Failed to update the client ${req.params.id} to the system : ${res.locals.updatedUser.error}`})
  return res.status(200).json("Client has been sucessfully updated on the system.")
}

export async function deleteClient(req, res, next) {
  await axios.delete(ministraAPI+'accounts/'+req.params.id, config)
    .then(response => {
      res.locals.deletingClient = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.deletingClient.status!=='OK') return res.status(404).json({ error: `failed to delete client ${req.params.id} : ${res.locals.deletingClient.error}`})
  return res.status(200).json(`Client with mac Address: ${req.params.id} successfully deleted.`)
}

