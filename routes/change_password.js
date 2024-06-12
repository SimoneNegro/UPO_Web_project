const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DataBase = require("../db");
const { generateToken } = require("../public/js/jwt-token"); // db.js
const db = new DataBase();

router.get('/', function (req, res, next) {
    console.log("Correct routing page: Change Password\n");
    return res.render('change_password', { user_id: req.user_id });
});

router.post('/', async function (req, res, next) {
    try {
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) {
                return next(err);
            }
            await db.updateUserPasswordById(req.session.user_id, hash);
            
            console.log("Updated user password\n");
            res.redirect('/');
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;