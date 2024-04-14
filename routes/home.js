const express = require('express');
const router = express.Router();

// home root
// add isStaff and isAdmin
router.get('/', function (req, res, next) {
    return res.render('home', { title: "NGR", user: req.user });
});

module.exports = router;