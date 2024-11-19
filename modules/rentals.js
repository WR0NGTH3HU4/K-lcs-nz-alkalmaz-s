const express = require('express');
const db = require('./database');
const uuid = require('uuid');
const moment = require('moment')
const router = express.Router();

router.post('/newdata', (req, res) => {
    let { title, type } = req.body; 

    if (!title || !type) {
        req.session.msg = 'Hiányzó adatok!';
        req.session.severity = 'danger';
        res.redirect('/newdata');
        return;
    }

        db.query(`INSERT INTO items (title, type, available) VALUES(?, ?, 1)`, 
                [title, type], (err, results) => { 
                if (err){
                    req.session.msg = 'Adatbázis hiba!';
                    req.session.severity = 'danger';
                    res.redirect('/admin');
                    return;
                }
                req.session.msg = 'Elem hozzáadva!';
                req.session.severity = 'success';
                res.redirect('/newdata');
        });
})

router.post('/rent', (req, res) => {
    const { userID, itemID } = req.body;

    if (!userID || !itemID) {
        req.session.msg = 'Hiányzó adatok!';
        req.session.severity = 'danger';
        return res.redirect('/rental');
    }

    // Ellenőrizzük, hogy a user létezik
    db.query(`SELECT * FROM users WHERE ID = ?`, [userID], (err, userResults) => {
        if (err) {
            console.error('Adatbázis hiba:', err);
            req.session.msg = 'Adatbázis hiba!';
            req.session.severity = 'danger';
            return res.redirect('/rental');
        }
        
        if (userResults.length === 0) {
            req.session.msg = 'Felhasználó nem található!';
            req.session.severity = 'warning';
            return res.redirect('/rental');
        }

        // Ellenőrizzük az elem elérhetőségét
        db.query(`SELECT available FROM items WHERE id = ?`, [itemID], (err, results) => {
            if (err) {
                console.error('Adatbázis hiba:', err);
                req.session.msg = 'Adatbázis hiba!';
                req.session.severity = 'danger';
                return res.redirect('/rental');
            }

            if (results.length === 0) {
                req.session.msg = 'Nem létező elem!';
                req.session.severity = 'warning';
                return res.redirect('/rental');
            }

            if (results[0].available === 0) {
                req.session.msg = 'Ez az elem nem érhető el!';
                req.session.severity = 'warning';
                return res.redirect('/rental');
            }

            // Kölcsönzés hozzáadása
            const rentalDate = moment().format('YYYY-MM-DD');
            db.query(
                `INSERT INTO rentals (user_ID, item_ID, rental_date) VALUES (?, ?, ?)`,
                [userID, itemID, rentalDate],
                (insertErr) => {
                    if (insertErr) {
                        console.error('Adatbázis hiba a kölcsönzésnél:', insertErr);
                        req.session.msg = 'Adatbázis hiba a kölcsönzésnél!';
                        req.session.severity = 'danger';
                        return res.redirect('/rental');
                    }

                    // Elem állapotának frissítése
                    db.query(
                        `UPDATE items SET available = 0 WHERE id = ?`,
                        [itemID],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Adatbázis frissítési hiba:', updateErr);
                                req.session.msg = 'Adatbázis frissítési hiba!';
                                req.session.severity = 'danger';
                                return res.redirect('/rental');
                            }

                            req.session.msg = 'Kölcsönzés sikeres!';
                            req.session.severity = 'success';
                            res.redirect('/rental');
                        }
                    );
                }
            );
        });
    });
});




module.exports = router;

