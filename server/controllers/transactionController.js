import transactionRepo from '../models/transactionModel'
import userRepo from '../models/userModel'
import clientRepo from '../models/clientModel'
import configRepo from '../models/configModel'
import { checkPermissionRights } from '../_helpers/checkPermission'
import { winstonLogger } from '../_helpers/logger'
import axios from 'axios'
import dateFns from 'date-fns'

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

export async function checkPermission(req, res, next) {
  winstonLogger.info("Running Operation checkPermission...")
  const macRegex = /^[a-fA-F0-9:]{17}|[a-fA-F0-9]{12}$/
  if (macRegex.test(req.params.id)) {
    const client = await clientRepo.findOne({ clientMac: req.params.id })
    if (!client) return res.status(422).json({ error: `Client with mac Address ${req.params.id} was not found in mongo DB` })
    if (await checkPermissionRights(req.params.id, req.user, 0) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  }
  else {
    const user = await userRepo.findOne({ username: req.params.id })
    if (!user) return res.status(422).json({ error: `User with username ${req.params.id} was not found in DB` })
    if (await checkPermissionRights(user, req.user, 1) == false) return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  }
  next()
}

export async function getTransactionsForUser(req, res, next) {
  winstonLogger.info("Running Operation getTransactionsForUser...")
  const transactions = await transactionRepo.find({ $or: [{ transactionTo: { $in: req.params.id } }, { transactionFrom: { $in: req.params.id } }] }, null, { sort: { createdAt: -1 } })
  return res.status(200).json(transactions)
}

export async function addTransaction(req, res, next) {
  winstonLogger.info("Running Operation addTransaction...")
  const transactionFrom = req.user.username
  const { credits, description, transactionTo } = req.value.body
  if (!req.user.childUsernames.includes(transactionTo) && req.user.userType !== "superAdmin" ) return res.status(403).json(`You can't add credits to the user ${transactionTo}`)
  if (req.user.userType == "reseller") {
    // Mongo transactions
    const client = await clientRepo.findOne({ clientMac: transactionTo })
    if (credits == 0) return res.status(400).json('You cant add/recover 0 credits...')
    if (credits > 0 && req.user.creditsAvailable == 0  && client.accountBalance == 0) return res.status(400).json(`You have no enough credits to transfer.`)
    if (credits < 0 && client.accountBalance < (-1 * credits)) return res.status(400).json("Not enough balance to recover the credits. Try again with lesser credits.")
    if (client.accountBalance == 0 && credits > 0){
      await req.user.update({ creditsAvailable: (req.user.creditsAvailable - 1), creditsOwed: (req.user.creditsOwed + (credits-1))  })
      await clientRepo.findOneAndUpdate({ clientMac: transactionTo }, { $inc: { accountBalance: credits-1 } })
    }
    if (client.accountBalance > 0 && credits > 0){
      await req.user.update({ creditsOwed: (req.user.creditsOwed + credits)  })
      await clientRepo.findOneAndUpdate({ clientMac: transactionTo }, { $inc: { accountBalance: credits } })
    }
    if ((client.accountBalance + credits) == 0 && credits < 0){
      await req.user.update({ creditsAvailable: (req.user.creditsAvailable + 1), creditsOwed: (req.user.creditsOwed + (credits+1))  })
      await clientRepo.findOneAndUpdate({ clientMac: transactionTo }, { $inc: { accountBalance: credits } })
    }
    if ((client.accountBalance + credits) > 0 && credits < 0){
      await req.user.update({ creditsOwed: (req.user.creditsOwed + credits)  })
      await clientRepo.findOneAndUpdate({ clientMac: transactionTo }, { $inc: { accountBalance: credits } })
    }

    // Ministra Transactions
    await axios.get(ministraAPI + 'accounts/' + transactionTo, config)
      .then(response => {
        res.locals.clientExpiryDate = response.data.results[0].tariff_expired_date
      })
    let expiredDate = []
    if (res.locals.clientExpiryDate == null || res.locals.clientExpiryDate == "0000-00-00 00:00:00") {
      expiredDate = await `tariff_expired_date=${expiryDateAfterTransaction(0, credits)}`
    }
    else {
      expiredDate = await `tariff_expired_date=${expiryDateAfterTransaction(res.locals.clientExpiryDate, credits)}`
    }
    await axios.put(ministraAPI + 'accounts/' + transactionTo,
      expiredDate, config)
      .then(response => {
        res.locals.updatedUser = response.data
      })
  }
  else {
    // Non reseller transactions
    if(req.user.userType == "superAdmin" && (transactionTo !== req.user.username && !req.user.childUsernames.includes(transactionTo))) return res.status(403).json(`You cant add credits to the user ${transactionTo}`)
    if(req.user.userType == "superAdmin" && transactionTo == req.user.username) {
      await userRepo.findOneAndUpdate({ username: transactionTo }, { $inc: { creditsAvailable: credits } })
    }
    else {
      if (credits > 0 && req.user.creditsAvailable < credits) return res.status(400).json(`You have no enough credits to transfer.`)   
      const minAddConfig = await configRepo.findOne({ configName : "minimumTransferrableCredits" })
      const recoverUptoConfig = await configRepo.findOne({ configName : "creditsRecoverableUpto" })
      if (credits > 0 && credits < minAddConfig.configValue) return res.status(400).json(`Minimum Transferrable Credits is ${minAddConfig.configValue}.`)
      const user = await userRepo.findOne({ username: transactionTo })
      if (credits < 0 && user.creditsAvailable < (-1 * credits)) return res.status(400).json("Not enough balance to recover the credits. Try again with lesser credits.")
      if (credits < 0 && req.user.userType == "superReseller" && (-1 * credits) < recoverUptoConfig.configValue) return res.status(400).json(`You can only recover upto ${recoverUptoConfig.configValue}.`)
      if (req.user.creditsAvailable > credits) await req.user.update({ creditsAvailable: (req.user.creditsAvailable - credits) })
      await userRepo.findOneAndUpdate({ username: transactionTo }, { $inc: { creditsAvailable: credits } })
    }
  }
  // Add transaction history to transaction collection
  const createdTransaction = await transactionRepo.create([{ credits, description, transactionFrom, transactionTo }], { lean: true })
  const transaction = createdTransaction[0]
  return res.status(201).json({ transaction })
}

function expiryDateAfterTransaction(date, n) {
  winstonLogger.info("Running Operation expiryDateAfterTransaction...")
  var resDate
  if (date == 0) {
    resDate = dateFns.startOfTomorrow()
  }
  else {
    var startOfTmrw = dateFns.startOfTomorrow()
    resDate = new Date(date)
    if (resDate < startOfTmrw) resDate = startOfTmrw
  }
  resDate = dateFns.addMonths(resDate, n)
  if (resDate < startOfTmrw) resDate = startOfTmrw
  return dateFns.format(resDate, 'YYYY-MM-DD')
}