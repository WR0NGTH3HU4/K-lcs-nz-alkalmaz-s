// app.js
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

// Session beállítás
app.use(session({
    secret: 'secret-key', // Titkos kulcs
    resave: false,
    saveUninitialized: true
}));

// Route-ok beállítása
app.use('/', coreRoutes);
app.use('/users', userRoutes);

// Alkalmazás indítása
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
