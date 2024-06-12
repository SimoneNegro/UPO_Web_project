const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log("Correct routing page: Privacy Policy\n");
    return res.render('privacy_policy', { title: 'Privacy Policy', user: req.user });
});

module.exports = router;