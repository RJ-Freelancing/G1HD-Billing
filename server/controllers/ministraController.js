// I just tested to get all the fields, but we only need some fields ! 
// Also, these functions can be private. Just call them from the normal GET all users call


import mysql from 'mysql'

var connection = mysql.createConnection({
  host     : process.env.MINISTRA_DB_HOST,
  user     : process.env.MINISTRA_DB_USER,
  password : process.env.MINISTRA_DB_PW,
  database : process.env.MINISTRA_DB_NAME
});

export function getAllClients() {
  return new Promise(function (resolve, reject){
    connection.query('SELECT * FROM users', (err,rows) => {
      if(err) {
        console.log("Error querying Ministra DB : " + err)
        return reject(err);
      }
      console.log('Data successfully received from Ministra Db:\n')
      resolve(rows);
    })
  })
}


export function getClients(macAdresses) {
  return new Promise(function (resolve, reject){
    connection.query(`SELECT * FROM users WHERE mac IN (${macAdresses.map(x => "'" + x + "'")})`, (err, rows)  => {
      if(err) {
        console.log("Error querying Ministra DB : " + err)
        return reject(err);
      }
      console.log('Data successfully received from Ministra Db:\n')
      resolve(rows);
    })
  })
}