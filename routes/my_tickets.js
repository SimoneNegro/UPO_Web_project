const express = require('express');
const router = express.Router();
const db = require('../db');

// my-tickets root
router.get('/', function (req, res, next) {
    db.get('SELECT COUNT(*) AS num_user_ticket FROM ticket t INNER JOIN utente u ON t.id_utente = u.id WHERE u.id = ?', [req.user.id], function (err, row) {
        if (err) { return done(err); }
        res.render('my_tickets', { title: "My Tickets", user: req.user, num_tickets: row });
    });
});

module.exports = router;