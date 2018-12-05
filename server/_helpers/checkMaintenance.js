import path from 'path'
import configRepo from '../models/configModel'
import { winstonLogger } from '../_helpers/logger'

// Page to show under maintenance
export async function checkMaintenance(req, res, next){
  winstonLogger.info("Running checkMaintenance Operation.")
  const isCronRunning = (await configRepo.findOne({ configName : "runningCron" })).configValue
  if(isCronRunning){
     return res.sendFile(path.join(__dirname , '../maintenance', 'index.html'));
  }
  next()
}