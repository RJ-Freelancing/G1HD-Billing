import transactionRepo from '../models/transactionModel'
import userRepo from '../models/userModel'
import clientRepo from '../models/clientModel'
import { checkPermissionRights } from '../_helpers/checkPermission'
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

export async function checkPermission(req, res, next) {
  const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/
  if(macRegex.test(req.params.id)){
    const client = await clientRepo.findOne({ clientMac : req.params.id})
    if (!client) return res.status(404).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` }) 
    if(await checkPermissionRights(client, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  }
  else {
    const user = await userRepo.findOne({ username : req.params.id})
    if (!user) return res.status(404).json({ error: `User with username ${req.params.id} was not found in DB` }) 
    if(await checkPermissionRights(user, req.user, 1) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  }
  next()
}

export async function getTransactionsForUser(req, res, next) {
  const transactions = await transactionRepo.find({$or:[ {transactionTo: { $in: req.params.id}}, {transactionFrom: { $in: req.params.id}}]}, null, { sort: { credits: 1 } })
  return res.status(200).json(transactions)
}

export async function addTransaction(req, res, next) {
  const transactionFrom = req.user.username
  const { credits, description, transactionTo } = req.value.body
  if (!req.user.childUsernames.includes(transactionTo)) return res.status(403).json(`You cant add credits to the user ${transactionTo}`)
  if (req.user.creditsAvailable < credits && req.user.creditsOnHold < credits ) return res.status(400).json(`You have no enough credits to transfer.`)
  if (req.user.creditsAvailable > credits) {
    await req.user.update({creditsAvailable : (req.user.creditsAvailable-credits)} )
  }
  else {
    await req.user.update({creditsOnHold : (req.user.creditsOnHold-credits)} )
  }
  if (req.user.userType == "reseller"){
    await clientRepo.findOneAndUpdate({clientMac : transactionTo}, { $inc: { accountBalance : credits }})
  }
  else {
    await userRepo.findOneAndUpdate({username : transactionTo}, { $inc : { creditsAvailable : credits }})
  }
  await axios.get(ministraAPI+'accounts/'+transactionTo, config)
  .then(response => {
    res.locals.clientExpiryDate = response.data.results[0].tariff_expired_date
  })
  .catch(error => {
    console.log("Ministra API Error : " + error)
  })
  if (res.locals.clientExpiryDate == null){
    const expiredDate = `tariff_expired_date=${dateAfterNthMonth(1)}`
    await axios.put(ministraAPI+'accounts/'+transactionTo,
    expiredDate, config) 
      .then(response => {
        res.locals.updatedUser = response.data
      })
      .catch(error => {
        console.log("Ministra API Error : " + error)
      })
  }
  const transaction = await transactionRepo.create([{ credits, description, transactionFrom, transactionTo }], {lean:true})
  return res.status(201).json({transaction})
}

function dateAfterNthMonth(n) {
  var d = new Date(),
      month = '' + (d.getMonth() + 1+n),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}