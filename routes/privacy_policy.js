const express = require('express');
const router = express.Router();

// privacy_policy root
router.get('/', function (req, res, next) {
    res.render('privacy_policy', {title: 'Privacy Policy'});
});

module.exports = router;