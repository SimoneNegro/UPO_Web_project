const express = require('express');
const router = express.Router();

// cookie_policy root
router.get('/', function (req, res, next) {
    res.render('cookie_policy', {title: 'Cookie Policy'});
});

module.exports = router;