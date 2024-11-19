require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const coreRoutes = require('./modules/core');
const userRoutes = require('./modules/users');
const rentalRoutes = require('./modules/rentals');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

// Middleware beállítások
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('assets'));

// Session middleware beállítása (csak egyszer!)
app.use(session({
    secret: process.env.SESSION_SECRET,  //
    resave: false,               
    saveUninitialized: true      
}));

// Route-ok beállítása
app.use('/', coreRoutes);
app.use('/users', userRoutes);
app.use('/rentals', rentalRoutes)

// Alkalmazás indítása
app.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});
