require('dotenv').config();
const express = require('express');
var session = require('express-session');

const app = express();
const coreRoutes = require('./modules/core');
var port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/assets', express.static('assets'));

app.use('/', coreRoutes);

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});

