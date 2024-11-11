const express = require('express');
const ejs = require('ejs');

const router = express.Router();

router.get('/', (req, res) => {
    ejs.renderFile('./views/landing.ejs', (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        
        res.send(html);
    });
});

module.exports = router;