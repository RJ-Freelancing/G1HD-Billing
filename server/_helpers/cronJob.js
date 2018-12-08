import axios from 'axios'
import { getClientsCron } from '../_helpers/ministraHelper'
import { ministraAPI, config } from '../controllers/ministraController'
import { mergeArrayObjectsByKey } from '../controllers/userController'
import clientRepo from '../models/clientModel'
import configRepo from '../models/configModel'
import { winstonLoggerCron } from './logger'
import userRepo from '../models/userModel'
import dateFns from 'date-fns'

export async function nightlyCronJob(){
    winstonLoggerCron.info('Started Daily Maintenance Cron Job...')
    winstonLoggerCron.info('Updating runningCron value to true to stop API calls...')
    // await configRepo.findOneAndUpdate({ configName : 'runningCron' }, { configValue : true })
    winstonLoggerCron.info('Delaying 1 Minute till starting activities...')
    await delay(3000).then();
    winstonLoggerCron.info('Completed Delay...')
    const ministraClients = await getClientsCron()
    const mongoClients = await clientRepo.find({})
    const mergedClients = mergeArrayObjectsByKey(mongoClients, ministraClients, 'clientMac', 'stb_mac')
    let ministraMacMap = ministraClients.map(x => x.stb_mac)
    let mongoMacMap = mongoClients.map(x => x.clientMac)
    let extrasOnMinistra = ministraMacMap.filter(x => !mongoMacMap.includes(x))
    let extrasOnMongo = mongoMacMap.filter(x => !ministraMacMap.includes(x))
  
    winstonLoggerCron.info('Starting Deletion of Extra Clients on Mongo : ' + extrasOnMongo)
    await asyncForEach(extrasOnMongo, async (element) => {
      const delClient = await clientRepo.findOne({ clientMac : element })
      await userRepo.findOneAndUpdate({ username: delClient.parentUsername }, { $pull: { childUsernames: delClient.clientMac } })
      await delClient.remove()
      winstonLoggerCron.info('Deleted : ' + element)
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
    await asyncForEach(mergedClients, async (element) => {
      const cronCheckDate = dateFns.subMonths(element.tariff_expired_date, element.accountBalance)
      const parent = await userRepo.findOne({ username : element.parentUsername })

      // Delete client if expiry date is more than a month
      let deletingMinistraClient
      if(dateFns.isBefore(element.tariff_expired_date, dateFns.subMonths(new Date(), 1)) && element.accountBalance == 0){
        console.log("RUNNING");
        await axios.delete(ministraAPI + 'accounts/' + element.stb_mac, config)
        .then(response => {
          deletingMinistraClient = response.data
          if (response.data.status == 'OK') {
            winstonLoggerCron.info('Deleted Client ' + element.clientMac + ' from ministra system.')
          }
        })
        if (deletingMinistraClient.status !== 'OK') {
          winstonLoggerCron.info('Failed to Delete Client ' + element.clientMac + ' from ministra system.')
        }
        else {
          await parent.update({ $pull: { childUsernames: element.clientMac } })
          const deletedMongoClient = await clientRepo.findOneAndRemove({ clientMac : element.clientMac })
          if(deletedMongoClient) winstonLoggerCron.info('Deleted Client : ' + element.clientMac + ' from DB')
        }
      }

      // in db status = 1 means inactive
      if (element.accountBalance > 0 && dateFns.isToday(cronCheckDate)){
        if( parent.creditsAvailable > 0 ){
          await userRepo.findOneAndUpdate({ username : element.parentUsername }, { $inc: { creditsAvailable : -1, creditsOwed : -1 } })
          await clientRepo.findOneAndUpdate({ clientMac : element.clientMac }, { $inc: { accountBalance : -1 } } )
        }
        else {
          await axios.put(ministraAPI + 'accounts/' + element.stb_mac,
            'status=0', config)
            .then(response => {
              if (response.data.status == 'OK') winstonLoggerCron.info('Updated Client ' + element.clientMac +  ' Status to False')
            })
        }
      }
      else if(element.accountBalance > 0 && element.status == 1){
        if( parent.creditsAvailable > 0 ){
          await axios.put(ministraAPI + 'accounts/' + element.stb_mac,
            'status=1', config)
            .then(response => {
              if (response.data.status == 'OK') winstonLoggerCron.info('Updated Client ' + element.clientMac +  ' Status to True')
            })
            await userRepo.findOneAndUpdate({ username : element.parentUsername }, { $inc: { creditsAvailable : -1, creditsOwed : -1 } })
            await clientRepo.findOneAndUpdate({ clientMac : element.clientMac }, { accountBalance : (element.accountBalance-1) } )  
        }
      }
    })

    winstonLoggerCron.info('Updating runningCron value to false to allow back API calls...')
    // await configRepo.findOneAndUpdate({ configName : 'runningCron' }, { configValue : false })
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