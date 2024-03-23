const express = require('express');
const router = express.Router();
const passport = require('passport');

// login root
router.get('/', function(req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null;

    res.render('login', { message: errorMessage });
});

// check if user email and password are correct
router.post('/', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            req.session.errorMessage = 'Email or password are incorrect.';
            return res.redirect('/login');
        }
        req.login(user, function (err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    })(req, res, next);
});

module.exports = router;
