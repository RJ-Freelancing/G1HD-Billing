import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionRights } from '../_helpers/checkPermission'

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
  if(await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  next()
}

export async function addClient(req, res, next) {
  if(req.user.userType !== 'reseller') return res.status(403).json({error: `You have no rights to add this client.`})
  const { stb_mac } = req.value.body
  await axios.get(ministraAPI+'accounts/'+stb_mac, config)
    .then(response => {
      res.locals.existingClient = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
    const ministraPayLoad = querystring.stringify(req.value.body)+"&comment="+req.user.username
  if (res.locals.existingClient.status=='OK') return res.status(401).json({ error: `Client already exists with mac Address ${stb_mac} in the system`})
  
  await axios.post(ministraAPI+'accounts/',
  ministraPayLoad, config)
    .then(response => {
      res.locals.addedUser = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
    })
  if (res.locals.addedUser.status!=='OK') return res.status(404).json({ error: `Failed to add a client to the system : ${res.locals.addedUser.error}`})
  res.status(201).json("Client has been sucessfully added to the system.")
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