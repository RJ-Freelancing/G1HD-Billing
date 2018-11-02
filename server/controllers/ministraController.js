// I just tested to get all the fields, but we only need some fields ! 
// Also, these functions can be private. Just call them from the normal GET all users call


import mysql from 'mysql'

var connection = mysql.createConnection({
  host     : process.env.MINISTRA_DB_HOST,
  user     : process.env.MINISTRA_DB_USER,
  password : process.env.MINISTRA_DB_PW,
  database : process.env.MINISTRA_DB_NAME
});



export async function getAllUsers(req, res, next) {
  connection.query('SELECT * from users', function (err, rows, fields) { 
    if (err) return res.status(200).json(err);
    return res.status(200).json(rows)
  }) 
}


export async function getUser(req, res, next) {
  const { username } = req.params
  connection.query(`SELECT * from users WHERE mac='${username}'`, function (err, rows, fields) { 
    if (err) return res.status(200).json(err);
    return res.status(200).json(rows[0])
  }) 
}


// BELOW IS ASYNC AWAIT version.. But it looks slower than the traditional fallback function method above.
//  Example. GET ALL CLIENTS takes 1.5seconds in aysnc, but only 300ms in fallback


// import mysql from 'mysql2/promise'


// async function setupConnection() {
//   return await mysql.createConnection({
//     host     : process.env.MINISTRA_DB_HOST,
//     user     : process.env.MINISTRA_DB_USER,
//     password : process.env.MINISTRA_DB_PW,
//     database : process.env.MINISTRA_DB_NAME
//   });
// }

// export async function getAllUsers(req, res, next) {
//   const connection = await setupConnection();
//   const [rows] = await connection.execute('SELECT * from users');
//   connection.end()
//   if (!rows) return res.status(422).json(rows);
//   return res.status(200).json(rows)
// }


// export async function getUser(req, res, next) {
//   const connection = await setupConnection();
//   const { username } = req.params
//   const [rows] = await connection.execute(`SELECT * from users WHERE mac='${username}'`);
//   connection.end()
//   if (!rows) return res.status(422).json(rows);
//   return res.status(200).json(rows[0])
// }
