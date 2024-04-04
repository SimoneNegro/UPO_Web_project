const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// signup root
router.get('/', function (req, res, next) {
    let errorMessage;
    if (req.query.error !== undefined)
        errorMessage = "Email do not exist."

    return res.render('forgot_password', { message: errorMessage });
});


router.post('/', async function (req, res, next) {
    try {
        const user = await db.findUserByEmail(req.body.email);
        if (!user) {
            return res.redirect('/forgot-password?error=email_not_exist');
        }

        return res.redirect('/otp');
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;