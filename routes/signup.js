const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const DataBase = require("../db"); // db.js
const db = new DataBase();

const { generateToken } = require('../public/js/jwt-token');

let returnUrl = "";

router.get('/', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null;
    returnUrl = req.query.return;

    console.log("Correct routing page: Signup\n");
    return res.render('signup', { message: errorMessage });
});

router.post('/', async function (req, res, next) {
    try {
        if (await db.findUserByEmail(req.body.email)) {
            req.session.errorMessage = 'Email already exists.';
            console.log("Error: email already exists\n");
            return res.redirect('/signup');
        }

        bcrypt.hash(req.body.password, 10, async function (err, hash) {
            if (err) return next(err);
            
            await db.addNewUser(req.body.email, hash);

            const userFound = await db.findUserByEmail(req.body.email);

            await db.addTokenToUser(userFound.id, generateToken(userFound.id));

            if (userFound) {
                var user = {
                    id: userFound.id,
                    username: req.body.email
                };
                // generare il token
                req.login(user, function (err) {
                    if (err) return next(err);
                    
                    if (!returnUrl) {
                        console.log("User signed up\n");
                        return res.redirect('/');
                    }

                    console.log("User signed up\n");
                    return res.redirect(returnUrl);
                });
            }
        });
    } catch (err) {
        console.error("Error creating new user:", err);
    }
});

module.exports = router;