const express = require('express');
const router = express.Router();
const db = require('../db');

// ticket root
router.get('/', function (req, res, next) {
    db.all('SELECT * FROM topic', function (err, row) {
        if (err) { return done(err); }
        res.render('ticket', { title: "Open a ticket", user: req.user, topics: row });
    });
});

module.exports = router;