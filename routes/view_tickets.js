const express = require('express');
const router = express.Router();
const { isStaff } = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (isStaff(req)) { return res.render('admin/view_tickets', { title: "View Tickets", user: req.user }); }
    return res.redirect('/');
});

module.exports = router;