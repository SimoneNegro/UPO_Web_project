const express = require('express');
const router = express.Router();
const { isStaff } = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (isStaff(req)) { return res.render('admin/dashboard', { title: 'Ticket Dashboard', user: req.user }); }
    return res.redirect('/');
});

module.exports = router;