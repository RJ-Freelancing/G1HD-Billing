import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionMinistra } from '../_helpers/checkPermission'

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

export async function permissionCheck(req, res, next){
  if(req.params.id !== undefined){
    if(await checkPermissionMinistra(req.params.id, req.user) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`}) 
  }
  else {
    if(await checkPermissionMinistra(req.value.body.ids, req.user) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  }
  next()
}

export async function getTariffs(req, res, next) {
  await ministraGetCalls('tariffs/', res)
}

export async function sendMsg(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body)
  const mac = req.value.body.ids
  await ministraPostCalls('stb_msg/', ministraPayLoad, mac, res)
}

export async function sendEvent(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body)
  var mac = req.value.body.ids
  if (mac == "" && req.user.userType !== "super-admin") return res.status(403).json("You Have No Rights To Perform This Action.")
  if (mac == undefined)  return res.status(404).json("Mac Ids are missing...")
  await ministraPostCalls('send_event/', ministraPayLoad, mac, res)
}

export async function getAccountSub(req, res, next){
  const mac = req.params.id
  await ministraGetCalls('account_subscription/'+mac, res)
}

export async function postAccountSub(req, res, next){
  const payloadMap = req.value.body.subscribed.map(x => `subscribed[]=${x}&`).join('')
  const ministraPayLoad = payloadMap.substring(0, payloadMap.length-1)
  const mac = req.params.id
  await ministraPostCalls('account_subscription/', ministraPayLoad, mac, res)
}

export async function putAccountSub(req, res, next){
  const ministraPayLoad = querystring.stringify(req.value.body).replace("subscribed","subscribed[]")
  const mac = req.params.id
  await ministraPutCalls('account_subscription/', ministraPayLoad, mac, res)
}

export async function deleteAccountSub(req, res, next){
  const mac = req.params.id
  await ministraDeleteCalls('account_subscription/', mac, res)
}

async function ministraGetCalls(attribute, res){
  await axios.get(ministraAPI+attribute, config)
  .then(response => {
    if (response.data.status!=='OK') return res.status(404).json(response.data.error)
    return res.status(201).json(response.data.results)
  })
  .catch(error => {
    console.log("Ministra API Error : " + error)
    return res.status(404).json(error)
  })
}

async function ministraPostCalls(attribute, ministraPayLoad, mac, res){
  await axios.post(ministraAPI+attribute+mac,
  ministraPayLoad, config)
    .then(response => {
      if (response.data.status!=='OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

async function ministraPutCalls(attribute, ministraPayLoad, mac, res){
  await axios.put(ministraAPI+attribute+mac,
  ministraPayLoad, config)
    .then(response => {
      if (response.data.status!=='OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
  }

  async function ministraDeleteCalls(attribute, mac, res){
    await axios.delete(ministraAPI+attribute+mac,config)
      .then(response => {
        if (response.data.status!=='OK') return res.status(404).json(response.data.error)
        return res.status(201).json(response.data.results)
      })
      .catch(error => {
        console.log("Ministra API Error : " + error)
        return res.status(404).json(error)
      })
    }