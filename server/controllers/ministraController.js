import axios from 'axios'

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

export async function getTariffs(req, res, next) {
  await ministraGetCalls('tariffs/', res)
}

export async function sendMsg(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body.msg)
  const mac = req.value.body.ids
  await ministraPostCalls('stb_msg/', ministraPayLoad, mac, res)
}

export async function sendEvent(req, res, next) {
  const ministraPayLoad = querystring.stringify(req.value.body.event)
  var mac
  if (req.user.userType == "super-admin") {
    mac = ''
  }
  else{
    mac = req.value.body.ids
  }
  await ministraPostCalls('send_event/', ministraPayLoad, mac, res)
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