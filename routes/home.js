const express = require('express');
const router = express.Router();

// home root
router.get('/', function (req, res, next) {
    res.render('home', { title: "NGR", user: req.user });
});

module.exports = router;