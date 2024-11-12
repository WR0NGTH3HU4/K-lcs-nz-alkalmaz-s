// database.js
const mysql = require('mysql');

// Kapcsolódás az adatbázishoz
var pool  = mysql.createPool({
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
});

// Kapcsolódás ellenőrzése
pool.getConnection((err) => {
    if (err){
        console.log('Error connection to MySQL: ' + err);
    }else{
        console.log('connected to MySQL database.');
    }
});

module.exports = pool;
