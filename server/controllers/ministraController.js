import axios from 'axios'
import querystring from 'querystring'
import { checkPermissionMinistra } from '../_helpers/checkPermission'

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

export async function permissionCheck(req, res, next) {
  if (req.params.id !== undefined) {
    if (await checkPermissionMinistra(req.params.id, req.user) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  }
  else {
    if (await checkPermissionMinistra(req.value.body.ids, req.user) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  }
  next()
}

export async function getTariffs(req, res, next) {
  await ministraGetCalls('tariffs/', res)
}

export async function sendMsg(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body)
  const mac = req.value.body.ids
  var resultMap = await ministraPostCalls('stb_msg/', ministraPayLoad, mac, res)
  if((resultMap.error)) return res.status(404).json(resultMap.error)
  return res.status(201).json(resultMap.success)
}

export async function sendEvent(req, res, next) {
  let resultMap = {}
  const ministraPayLoad = querystring.stringify(req.value.body)
  var mac = req.value.body.ids
  if (mac == "" && req.user.userType !== "super-admin") return res.status(403).json("You Have No Rights To Perform This Action.")
  if (mac == undefined) return res.status(404).json("Mac Ids are missing...")
  if (mac.length > 30) {
    resultMap = await hugeMinistaPostCalls('send_event/', ministraPayLoad, mac, res)
  }
  else {
    resultMap = await ministraPostCalls('send_event/', ministraPayLoad, mac, res)
  }
  if(resultMap.error) return res.status(404).json(resultMap.error)
  return res.status(201).json(resultMap.success)
}

export async function getAccountSub(req, res, next) {
  const mac = req.params.id
  await ministraGetCalls('account_subscription/' + mac, res)
}

export async function postAccountSub(req, res, next) {
  const payloadMap = req.value.body.subscribed.map(x => `subscribed[]=${x}&`).join('')
  const ministraPayLoad = payloadMap.substring(0, payloadMap.length - 1)
  const mac = req.params.id
  var resultMap = await  ministraPostCalls('account_subscription/', ministraPayLoad, mac, res)
  if((resultMap.error)) return res.status(404).json((resultMap.error))
  return res.status(201).json(resultMap.success)
}

export async function putAccountSub(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body).replace("subscribed", "subscribed[]")
  const mac = req.params.id
  await ministraPutCalls('account_subscription/', ministraPayLoad, mac, res)
}

export async function deleteAccountSub(req, res, next) {
  const mac = req.params.id
  await ministraDeleteCalls('account_subscription/', mac, res)
}

async function ministraGetCalls(attribute, res) {
  await axios.get(ministraAPI + attribute, config)
    .then(response => {
      if (response.data.status !== 'OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

async function ministraPostCalls(attribute, ministraPayLoad, id, res) {
  let resultMap = {}
  await axios.post(ministraAPI + attribute + id,
    ministraPayLoad, config)
    .then(response => {
      res.locals.postResults = response.data
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      resultMap["error"] = error
    })
    if (res.locals.postResults.status !== 'OK') resultMap["error"] = res.locals.postResults.error
    resultMap["success"] = res.locals.postResults.results
    return resultMap
}

async function hugeMinistaPostCalls(attribute, ministraPayLoad, ids, res){
  let chunkedArr = await chunkArray(ids, 30)
  let responseList = []
  let resultMap = {}
  await asyncForEach(chunkedArr, async (element) => {
    var result = await ministraPostCalls(attribute, ministraPayLoad, element, res)
    responseList.push(result)
  })
  let errorList = []
  responseList.forEach( (element) => {
    if(element.error) errorList.push(element.error)
  })
  if(errorList.length == responseList.length) {
    resultMap["error"] = "All of the events failed"
  }
  else if(errorList.length == 0) {
    resultMap["success"] = true
  }
  else {
    resultMap["error"] = "Few of the events failed." 
  }
  return resultMap
}

async function ministraPutCalls(attribute, ministraPayLoad, mac, res) {
  await axios.put(ministraAPI + attribute + mac,
    ministraPayLoad, config)
    .then(response => {
      if (response.data.status !== 'OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

async function ministraDeleteCalls(attribute, mac, res) {
  await axios.delete(ministraAPI + attribute + mac, config)
    .then(response => {
      if (response.data.status !== 'OK') return res.status(404).json(response.data.error)
      return res.status(201).json(response.data.results)
    })
    .catch(error => {
      console.log("Ministra API Error : " + error)
      return res.status(404).json(error)
    })
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function chunkArray(myArray, chunk_size) {
  let results = [];
  
  while (myArray.length) {
      results.push(myArray.splice(0, chunk_size))
  }

  return results;
}