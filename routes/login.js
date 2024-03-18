const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', function (req, res, next) {
    res.render('login');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true // Enable flash messages for failure
}));

module.exports = router;
