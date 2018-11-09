import configRepo from '../models/configModel'

export async function updateConfig(req, res, next){
  if (req.user.userType !== 'super-admin') res.status(403).json({ error: `You Have No Rights To Perform This Action.`})
  const { configName, configValue } = req.value.body
  var query = {configName},
    update = { configName, configValue},
    options = { upsert: true, new: true, setDefaultsOnInsert: true }

  const config = await configRepo.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) return res.status(404).json(error)
  })
  return res.status(200).json(config)
}