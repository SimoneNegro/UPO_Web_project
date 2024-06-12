const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    console.log("Correct routing page: Terms Of Service\n");
    return res.render('term_of_service', { title: 'Terms Of Service', user: req.user });
});

module.exports = router;