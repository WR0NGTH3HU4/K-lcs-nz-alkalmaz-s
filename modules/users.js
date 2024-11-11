// users.js
const express = require('express');
const db = require('./database');
const uuid = require('uuid');
const router = express.Router();

// Jelszó szabályok
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Regisztráció route
router.post('/reg', (req, res) => {
    let { name, email, passwd, confirm } = req.body;

    console.log('Kapott adatok:', name, email, passwd, confirm); // Ellenőrzés céljából

    if (!name || !email || !passwd || !confirm) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    if (passwd !== confirm) {
        req.session.msg = 'Passwords do not match!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    if (!passwd.match(passwdRegExp)) {
        req.session.msg = 'Password is weak!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return;
    }

    // Ellenőrizni, hogy az e-mail már regisztrálva van-e
    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);  // Részletes hibajelentés
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            return res.redirect('/reg');
        }

        if (results.length > 0) {
            req.session.msg = 'This email is already registered!';
            req.session.severity = 'danger';
            return res.redirect('/reg');
        }

        // Felhasználó hozzáadása az adatbázishoz
        db.query(`INSERT INTO users (ID, name, email, passwd) 
        VALUES(?, ?, ?, SHA1(?))`, 
        [uuid.v4(), name, email, passwd], (err, results) => {
            if (err) {
                console.error('Database insert error:', err); // További részletes hibajelentés
                req.session.msg = 'Database error during insertion!';
                req.session.severity = 'danger';
                res.redirect('/reg');
                return;
            }
    
            req.session.msg = 'User registered successfully!';
            req.session.severity = 'success';
            res.redirect('/');
        });
    
    });
});

module.exports = router;
