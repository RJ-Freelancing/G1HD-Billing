import mysql from 'mysql'

var connection = mysql.createConnection({
  host     : process.env.MINISTRA_DB_HOST,
  user     : process.env.MINISTRA_DB_USER,
  password : process.env.MINISTRA_DB_PW,
  database : process.env.MINISTRA_DB_NAME
});

connection.connect()


// I just tested to get all the fields, but we only need some fields ! 
// Also, these functions can be private. Just call them from the normal GET all users call

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
    return res.status(200).json(rows)
  }) 
}