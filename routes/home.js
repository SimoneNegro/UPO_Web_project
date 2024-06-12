const express = require('express');
const router = express.Router();

const { isStaff } = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (isStaff(req)) {
        console.log("Access denied to Community: you are a staff member\n");
        return res.redirect('/admin');
    }

    console.log("Correct routing page: Homepage\n");
    return res.render('home', { title: "NGR", user: req.user });
});

module.exports = router;