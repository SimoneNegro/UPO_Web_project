const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log("Correct routing page: Cookie Policy\n");
    return res.render('cookie_policy', { title: 'Cookie Policy', user: req.user });
});

module.exports = router;