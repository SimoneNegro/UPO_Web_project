const express = require('express');
const router = express.Router();
const { isStaff } = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (isStaff(req)) { return res.render('admin/admin', { title: "Staff panel", user: req.user }); }
    return res.redirect('/');
});

module.exports = router;