const express = require('express');
const router = express.Router();

// ticket root
router.get('/', function (req, res, next) {
    res.render('ticket', { title: "Open a ticket", user: req.user });
});

module.exports = router;