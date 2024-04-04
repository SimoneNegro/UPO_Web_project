const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// otp root
router.get('/', function (req, res, next) {
    return res.render('otp');
});


// router.post('/', async function (req, res, next) {
    
// });

module.exports = router;