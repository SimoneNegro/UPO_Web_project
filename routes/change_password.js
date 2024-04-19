const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DataBase = require("../db");
const {generateToken} = require("../public/js/jwt-token"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    try {
        return res.render('change_password', {user_id: req.user_id});
    } catch (err) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) {
                return next(err);
            }
            await db.updateUserPasswordById(req.session.user_id, hash);
            res.redirect('/');
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;