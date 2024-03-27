const express = require('express');
const router = express.Router();
const db = require('../db');

// ticket root
router.get('/', function (req, res, next) {
    db.all('SELECT * FROM topic', function (err, row) {
        if (err) { return done(err); }
        res.render('my_tickets', { title: "My Tickets", user: req.user, tickets: row });
    });
});

module.exports = router;