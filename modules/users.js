require('dotenv').config(); // A .env fájl betöltése
const express = require('express');
const db = require('./database');
const CryptoJS = require('crypto-js');
const uuid = require('uuid');
const router = express.Router();

// Jelszó szabályok
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Regisztráció route
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

        // Jelszó hash-elése CryptoJS SHA1-el
        const hashedPassword = CryptoJS.SHA1(passwd).toString(CryptoJS.enc.Hex);

        // Felhasználó hozzáadása az adatbázishoz
        db.query(`INSERT INTO users (ID, name, email, passwd) 
        VALUES(?, ?, ?, ?)`, 
        [uuid.v4(), name, email, hashedPassword], (err, results) => {
            if (err) {
                console.error('Database insert error:', err); 
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


// Bejelentkezés route
router.post('/login', (req, res) => {
    let { email, password } = req.body;

  z
    console.log('Beérkezett adatok:', email, password);

    if (!email || !password) {
        req.session.msg = 'Hiányzó adatok!';
        req.session.severity = 'danger';
        res.redirect('/login');
        return;
    }

    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);  
            req.session.msg = 'Adatbázis hiba!';
            req.session.severity = 'danger';
            res.redirect('/login');
            return;
        }

        console.log('Query results:', results); 
        if (results.length === 0) {  
            req.session.msg = 'Érvénytelen bejelentkezési adatok! 1';
            req.session.severity = 'danger';
            res.redirect('/login');
            return;
        }

        console.log(password)
        const hashedPassword = CryptoJS.SHA1(password).toString(CryptoJS.enc.Hex);
        console.log(hashedPassword)
        console.log(results[0].passwd)
        if (hashedPassword !== results[0].passwd) {
            req.session.msg = 'Érvénytelen bejelentkezési adatok 2!';
            req.session.severity = 'danger';
            res.redirect('/login');
            return;
        }



        req.session.isLoggedIn = true;
        req.session.userID = results[0].ID;
        req.session.userName = results[0].name;
        req.session.userEmail = results[0].email;
        req.session.userRole = results[0].role;

        res.redirect('/rental');
    });
});

module.exports = router;
