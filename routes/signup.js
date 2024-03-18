const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const db = require('../db');

// signup root
router.get('/', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null; 

    res.render('signup', { message: errorMessage });
});

// execute users signup
router.post('/', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {

        if (results != undefined) {
            // create a session error for root function
            req.session.errorMessage = 'Email already exists.';
            return res.redirect('/signup');
        }

        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return next(err); }

            if (err) { return next(err); }
            db.run('INSERT INTO utente (email, password, tipo, salt) VALUES (?, ?, ?, ?)', [
                req.body.email,
                hashedPassword,
                "utente",
                salt
            ], function (err) {
                if (err) { return next(err); }
                var user = {
                    id: this.lastID,
                    username: req.body.username
                };
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            });
        });
    });
});

module.exports = router;