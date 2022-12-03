const mysql = require("mysql2")

// const process = require('process');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'node-db',
  password: process.env.DB_PASSWORD
})

module.exports = pool.promise()