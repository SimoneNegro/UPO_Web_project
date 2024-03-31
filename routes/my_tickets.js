const express = require('express');
const router = express.Router();
const db = require('../db');

// my-tickets root
router.get('/', function (req, res, next) {
    if (!req.user) { return res.render('my_tickets', { title: "My Tickets", user: req.user }); }

    // get how many tickets the user opened: if he opened more than one ticket, he see all tickets, otherwise he see another message
    db.get('SELECT COUNT(*) AS num_user_ticket FROM ticket t INNER JOIN utente u ON t.id_utente = u.id WHERE u.id = ?', [req.user.id], function (err, row) {
        if (err) { return done(err); }

        if (row.num_user_ticket == 0) { return res.render('my_tickets', { title: "My Tickets", user: req.user, num_tickets: row }); }

        // get all user tickets
        db.all('SELECT * FROM ticket WHERE id_utente = ?', [req.user.id], function (err, rows) {
            return res.render('my_tickets', { title: "My Tickets", user: req.user, num_tickets: row, tickets: rows });
        });
    });
});

module.exports = router;