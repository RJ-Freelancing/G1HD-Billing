import axios from 'axios'
import { getClientsCron } from '../_helpers/ministraHelper'
import { ministraAPI, config } from '../controllers/ministraController'
import clientRepo from '../models/clientModel'
import configRepo from '../models/configModel'
import { winstonLoggerCron } from './logger'

export async function nightlyCronJob(){
    winstonLoggerCron.info('Started Daily Maintenance Cron Job...')
    await configRepo.findOneAndUpdate({ configName : 'runningCron' }, { configValue : true })
    winstonLoggerCron.info('Delaying 1 Minute till starting activities...')
    await delay(60000).then();
    winstonLoggerCron.info('Completed Delay...')
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
    //Actual Logic Starts Here

    
    await configRepo.findOneAndUpdate({ configName : 'runningCron' }, { configValue : false })
    winstonLoggerCron.info('Daily Maintenance Cron Job is Completed Successfully...')
  }
  
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  function delay(ms){
    var ctr, rej, p = new Promise(function (resolve, reject) {
        ctr = setTimeout(resolve, ms);
        rej = reject;
    });
    p.cancel = function(){ clearTimeout(ctr); rej(Error("Cancelled"))};
    return p; 
}