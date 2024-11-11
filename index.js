require('dotenv').config();
const express = require('express');
var session = require('express-session');

const app = express();
var port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/assets', express.static('assets'));




app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});