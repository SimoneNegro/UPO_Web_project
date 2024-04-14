const express = require('express');
const router = express.Router();
const passport = require('passport');
const DataBase = require("../db"); // db.js
const db = new DataBase();

const {generateToken} = require('../public/js/jwt-token');
const {isStaff} = require('../public/js/auth');

let returnUrl = "";

// login root
router.get('/', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null;
    returnUrl = req.query.return;

    return res.render('login', {message: errorMessage});
});

// check if user email and password are correct
router.post('/', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.session.errorMessage = 'Email or password are incorrect.';
            return res.redirect('/login');
        }
        req.login(user, async function (err) {
            try {
                if (err) {
                    return next(err);
                }
                await db.addTokenToUser(user.id, generateToken(user.id));
                if (isStaff(req)) {
                    return res.redirect('/admin');
                }
                if (returnUrl) {
                    return res.redirect(returnUrl);
                }
                return res.redirect('/');
            } catch (err) {
                console.error("Error:", err);
                // TODO: handle error
            }
        });
    })(req, res, next);
});

module.exports = router;