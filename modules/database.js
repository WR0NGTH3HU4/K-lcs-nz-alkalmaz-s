// database.js
const mysql = require('mysql');

// Kapcsolódás az adatbázishoz
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Az adatbázis felhasználó
    password: '', // Az adatbázis jelszava
    database: '13a_kolcsonzes' // Az adatbázis neve
});

// Kapcsolódás ellenőrzése
db.connect((err) => {
    if (err) {
        console.error('Hiba a kapcsolódás során:', err);
        return;
    }
    console.log('Sikeres kapcsolódás az adatbázishoz.');
});

module.exports = db;
