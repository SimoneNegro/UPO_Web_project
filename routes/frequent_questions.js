const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DataBase = require("../db");
const {generateToken} = require("../public/js/jwt-token"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    try {
        return res.render('frequent_questions', {title: 'Frequent Questions', user: req.user});
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;