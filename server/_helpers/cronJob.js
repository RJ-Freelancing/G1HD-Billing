import axios from 'axios'
import { getClientsCron } from '../_helpers/ministraHelper'
import { ministraAPI, config } from '../controllers/ministraController'
import clientRepo from '../models/clientModel'
import { winstonLoggerCron } from './logger'

export async function nightlyCronJob(isMaintenance){
    isMaintenance = true
    winstonLoggerCron.info('Started Daily Maintenance Cron Job...')
    const ministraClients = await getClientsCron()
    const mongoClients = await clientRepo.find({})
    let ministraMacMap = ministraClients.map(x => x.stb_mac)
    let mongoMacMap = mongoClients.map(x => x.clientMac)
    let extrasOnMinistra = ministraMacMap.filter(x => !mongoMacMap.includes(x))
    let extrasOnMongo = mongoMacMap.filter(x => !ministraMacMap.includes(x))
  
    winstonLoggerCron.info('Starting Deletion of Extra Clients on Mongo : ' + extrasOnMongo)
    await asyncForEach(extrasOnMongo, async (element) => {
      const delClient = await clientRepo.findOneAndRemove({ clientMac : element })
      if(delClient) {
        winstonLoggerCron.info('Deleted : ' + element)
      }
    })
    
    winstonLoggerCron.info('Starting Deletion of Extra Clients on Ministra: ' + extrasOnMinistra)
    await asyncForEach(extrasOnMinistra, async (element) => {
      await axios.delete(ministraAPI + 'accounts/' + element, config)
      .then(response => {
        if (response.data.status == 'OK') {
            winstonLoggerCron.info('Deleted : ' + element)
        }
      })
    })
  
    isMaintenance = false
    winstonLoggerCron.info('Daily Maintenance Cron Job is Completed Successfully...')
    return isMaintenance
  }
  
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  const filenameGenerator = () => {
    const dateiso = new Date().toISOString()
    const datestr = dateiso.substr(0, 10)
    return `Cron_${datestr}.log`
  }