const mysql = require("mysql2");
// runs password information that will not be shared publically to run sql fatabase
require("dotenv").config()
// -- hopefully it imports correctly and connects
const db = mysql.createConnection({
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

module.exports = db;