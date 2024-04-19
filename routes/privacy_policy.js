const express = require('express');
const router = express.Router();

// privacy_policy root
router.get('/', function (req, res, next) {
    return res.render('privacy_policy', {title: 'Privacy Policy', user: req.user});
});

module.exports = router;