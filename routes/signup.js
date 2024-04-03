const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const DataBase = require("../db"); // db.js
const db = new DataBase();

let returnUrl = "";

// signup root
router.get('/', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null;
    returnUrl = req.query.return;

    return res.render('signup', { message: errorMessage });
});

// execute users signup
router.post('/', async function (req, res, next) {
    try {
        if (await db.findUserByEmail(req.body.email)) {
            req.session.errorMessage = 'Email already exists.';
            return res.redirect('/signup');
        }

        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) { return next(err); }
            await db.addNewUser(req.body.email, hash);

            const userFound = await db.findUserByEmail(req.body.email);
            if (userFound) {
                var user = {
                    id: userFound.id,
                    username: req.body.email
                };
                // generare il token
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    if (!returnUrl) { return res.redirect('/'); }
                    return res.redirect(returnUrl);
                });
            }
        });
    } catch (err) {
        console.error("Error creating new user:", err);
        // Render an error page or message to the user
    }
});

module.exports = router;