require('dotenv').config(); 
const express = require('express');
const session = require('express-session');
const coreRoutes = require('./modules/core');
const userRoutes = require('./modules/users');

const app = express();
const port = process.env.PORT || 3000;

// Middleware beállítások
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

// Session middleware beállítása (csak egyszer!)
app.use(session({
    secret: process.env.SESSION_SECRET,  // A SESSION_SECRET változó a .env fájlból
    resave: false,               // Ha nem módosult a session, nem mentjük újra
    saveUninitialized: true      // Az új session-t mindig elmentjük, még ha nincs is adat benne
}));

// Route-ok beállítása
app.use('/', coreRoutes);
app.use('/users', userRoutes);

// Alkalmazás indítása
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
