// core.js
const express = require('express');
const ejs = require('ejs');
const router = express.Router();

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

module.exports = router;
