const express = require('express');
const router = express.Router();

// term_of_service root
router.get('/', function (req, res, next) {
    return res.render('term_of_service', {title: 'Terms Of Service', user: req.user});
});

module.exports = router;