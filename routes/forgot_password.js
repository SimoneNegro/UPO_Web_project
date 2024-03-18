const express = require('express');
const router = express.Router();

// signup root
router.get('/', function (req, res, next) {
    res.render('forgot_password');
});

module.exports = router;