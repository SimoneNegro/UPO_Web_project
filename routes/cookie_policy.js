const express = require('express');
const router = express.Router();

// cookie_policy root
router.get('/', function (req, res, next) {
    return res.render('cookie_policy', {title: 'Cookie Policy', user: req.user});
});

module.exports = router;