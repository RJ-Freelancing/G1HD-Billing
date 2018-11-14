import configRepo from '../models/configModel'
import fs from 'fs'
import path from 'path'

const logDirectory = path.join(__dirname, '/../logs/')

export async function updateConfig(req, res, next) {
  if (req.user.userType !== 'super-admin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const { configName, configValue } = req.value.body
  var query = { configName },
    update = { configName, configValue },
    options = { upsert: true, new: true, setDefaultsOnInsert: true }

  const config = await configRepo.findOneAndUpdate(query, update, options, function (error, result) {
    if (error) return res.status(404).json(error)
  })
  return res.status(200).json(config)

}

export async function getConfig(req, res, next) {
  const config = await configRepo.find()
  if (!config) return res.status(404).json({ error: "No Configs Found." })
  let result = {}
  config.forEach(config => result[config.configName] = config.configValue)
  return res.status(200).json(result)
}

export async function readLog(req, res, next) {
  if (req.user.userType !== 'super-admin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
  const logFileName = req.params.filename
  console.log('logDirectory: ', logDirectory+logFileName);
  await fs.readFile(logDirectory+logFileName, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: err})
    return res.status(200).json(data)
  })
}

export async function getLogFiles(req, res, next) {
  if (req.user.userType !== 'super-admin') return res.status(403).json({ error: `You Have No Rights To Perform This Action.` })
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