import configRepo from '../models/configModel'
import fs from 'fs'
import path from 'path'
import { winstonLogger } from '../_helpers/logger'

const logDirectory = path.join(__dirname, '/../logs/cron/')

export async function updateConfig(req, res, next) {
  winstonLogger.info("Running Operation updateConfig...")
  if (req.user.userType !== 'superAdmin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const { configName, configValue } = req.value.body
  var query = { configName },
    update = { configName, configValue },
    options = { upsert: true, new: true, setDefaultsOnInsert: true }
  const configExists = await configRepo.findOne({ configName })
  if (!configExists) return res.status(422).json({ error: 'No such config exists' })
  const config = await configRepo.findOneAndUpdate(query, update, options, function (error, result) {
    if (error) return res.status(404).json(error)
  })
  return res.status(200).json(config)
}

export async function getConfig(req, res, next) {
  winstonLogger.info("Running Operation getConfig...")
  const config = await configRepo.find()
  if (!config) return res.status(404).json({ error: "No Configs Found." })
  let result = {}
  config.forEach(config => result[config.configName] = config.configValue)
  return res.status(200).json(result)
}

export async function readLog(req, res, next) {
  winstonLogger.info("Running Operation readLog...")
  if (req.user.userType !== 'superAdmin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const logFileName = req.params.filename
  await fs.readFile(logDirectory+logFileName, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: err})
    return res.status(200).json(data)
  })
}

export async function getLogFiles(req, res, next) {
  winstonLogger.info("Running Operation getLogFiles...")
  if (req.user.userType !== 'superAdmin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  let logFileList = []
  await fs.readdir(logDirectory, (err, files) => {
    if (err) return res.status(404).json({ error: err})
    files.forEach(file => {
      if (file.substring(file.lastIndexOf(".")+1, file.length) == "log")
        logFileList.push(file)
    });
    return res.status(200).json(logFileList)
  })
}