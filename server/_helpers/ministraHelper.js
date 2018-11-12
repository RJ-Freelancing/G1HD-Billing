import mysql from 'mysql'

var connection = mysql.createConnection({
  host: process.env.MINISTRA_DB_HOST,
  user: process.env.MINISTRA_DB_USER,
  password: process.env.MINISTRA_DB_PW,
  database: process.env.MINISTRA_DB_NAME
});


const SQL_SELECT_FIELDS = '\
  login, \
  fname AS full_name, \
  phone, \
  tariff_plan_id AS tariff_plan, \
  tariff_expired_date, \
  tariff_id_instead_expired AS tariff_instead_expired, \
  serial_number AS stb_sn, \
  mac AS stb_mac, \
  stb_type, \
  status, \
  now_playing_content, \
  ip, \
  version, \
  comment, \
  last_active \
'


export function getAllClients() {
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT ${SQL_SELECT_FIELDS} FROM users`, (err, rows) => {
      if (err) {
        console.log("Error querying Ministra DB : " + err)
        return reject(err);
      }
      console.log('Data successfully received from Ministra Db:\n')
      connection.pause();
      resolve(rows);
      connection.resume();
    })
  })
}


export function getClients(macAdresses) {
  return new Promise(function (resolve, reject) {
    connection.query(`SELECT ${SQL_SELECT_FIELDS} FROM users WHERE mac IN (${macAdresses.map(x => `'${x}'`)})`, (err, rows) => {
      if (err) {
        console.log("Error querying Ministra DB : " + err)
        return reject(err);
      }
      console.log('Data successfully received from Ministra DB:\n')
      connection.pause();
      resolve(rows);
      connection.resume();
    })
  })
}