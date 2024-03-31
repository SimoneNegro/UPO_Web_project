const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../db');

let returnUrl = "";

// signup root
router.get('/', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null;
    returnUrl = req.query.return;

    res.render('signup', { message: errorMessage });
});

// execute users signup
router.post('/', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {
        if (results != undefined) {
            req.session.errorMessage = 'Email already exists.';
            return res.redirect('/signup');
        }

        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) { return next(err); }
            db.run('INSERT INTO utente (email, password, tipo) VALUES (?, ?, ?)', [
                req.body.email,
                hash,
                "utente"
            ], function (err) {
                if (err) { return next(err); }
                var user = {
                    id: this.lastID,
                    username: req.body.username
                };
                // generare il token
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    if (!returnUrl) { return res.redirect('/'); }
                    return res.redirect(returnUrl);
                });
            });
        });
    });
});

module.exports = router;