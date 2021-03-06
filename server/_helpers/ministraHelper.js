import mysql from 'mysql'
import { winstonLogger } from './logger'

var connection = mysql.createConnection({
  host: process.env.MINISTRA_DB_HOST,
  user: process.env.MINISTRA_DB_USER,
  password: process.env.MINISTRA_DB_PW,
  database: process.env.MINISTRA_DB_NAME
});

const SQL_CRON_SELECT_FIELDS = '\
  mac AS stb_mac, \
  CASE WHEN status=0 THEN 1 ELSE 0 END as status, \
  IFNULL(tariff_expired_date, "2000-01-01 00:00:00") AS tariff_expired_date \
  '


const SQL_SELECT_FIELDS = '\
  login, \
  fname AS full_name, \
  phone, \
  tariff_plan_id AS tariff_plan, \
  IFNULL(tariff_expired_date, "2000-01-01 00:00:00") AS tariff_expired_date, \
  tariff_id_instead_expired AS tariff_instead_expired, \
  serial_number AS stb_sn, \
  mac AS stb_mac, \
  stb_type, \
  CASE WHEN status=0 THEN 1 ELSE 0 END as status, \
  now_playing_content, \
  ip, \
  version, \
  comment, \
  last_active \
'


export function getAllClients() {
  winstonLogger.info("Running getAllClients Function...")
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT ${SQL_SELECT_FIELDS} FROM users`, (err, rows) => {
      if (err) {
        winstonLogger.error("Error querying Ministra DB : " + err)
        return reject(err);
      }
      winstonLogger.info('Data successfully received from Ministra Db:\n')
      connection.pause();
      resolve(rows);
      connection.resume();
    })
  })
}


export function getClients(macAdresses) {
  winstonLogger.info("Running getClients Function for macAdresses : " + macAdresses)
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT ${SQL_SELECT_FIELDS} FROM users WHERE mac IN (${macAdresses.map(x => `'${x}'`)})`, (err, rows) => {
      if (err) {
        winstonLogger.error("Error querying Ministra DB : " + err)
        return reject(err);
      }
      winstonLogger.info('Data successfully received from Ministra DB:\n')
      connection.pause();
      resolve(rows);
      connection.resume();
    })
  })
}

export function getClientsCron(){
  winstonLogger.info("Running getClientsCron Function")
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT ${SQL_CRON_SELECT_FIELDS} FROM users`, (err, rows) => {
      if (err) {
        winstonLogger.error("Error querying Ministra DB : " + err)
        return reject(err);
      }
      winstonLogger.info('Data successfully received from Ministra Db:\n')
      connection.pause();
      resolve(rows);
      connection.resume();
    })
  })
}