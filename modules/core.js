// core.js
const express = require('express');
const ejs = require('ejs');
const router = express.Router();
const db = require('./database')
const moment = require('moment')

// Landing oldal route
router.get('/', (req, res) => {
    ejs.renderFile('./views/landing.ejs', (err, html) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send(html);
    });
});

// Regisztrációs oldal route
router.get('/reg', (req, res) => {
    ejs.renderFile('./views/regist.ejs', { session: req.session }, (err, html) => {
        if (err) {
            console.log(err);
            return;
        }

        req.session.msg = ''; // Üzenet nullázása
        res.send(html);
    });
});

// Bejelentkezés oldal
router.get('/login', (req, res) => {
    ejs.renderFile('./views/login.ejs', { session: req.session }, (err, html) => {
        if (err) {
            console.log(err);
            return;
        }
        req.session.msg = '';
        res.send(html);
    });
});

// Kolcsonzo oldal
router.get('/rental', (req, res) => {
    db.query(`SELECT * FROM items`, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        let datas = results.map((element) => ({
            id: element.id, 
            title: element.title,
            type: element.type,
            available: element.available,
        }));

        ejs.renderFile('./views/rental.ejs', { session: req.session, results: datas }, (err, html) => {
            if (err) {
                console.log(err);
                return;
            }
            res.send(html);
        });
    });
});
//Uj adat fekvétele
router.get('/newdata', (req, res) => {
    ejs.renderFile('./views/newdata.ejs', { session: req.session }, (err, html) => {
        if (err) {
            console.log(err);
            return;
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Session destroy error:', err);
        }
      
        res.redirect('/');
    });
});

module.exports = router;
