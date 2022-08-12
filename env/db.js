const mysql = require('mysql2')
const dotenv = require('dotenv');
dotenv.config();


// connection config ======================
const db = mysql.createConnection({
    host: process.env.HMYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
})

module.exports = db