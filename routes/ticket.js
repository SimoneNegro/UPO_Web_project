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

router.post('/', function (req, res, next) {
    let data = new Date();

    db.run('INSERT INTO ticket (descrizione, data_apertura, stato, id_utente, nome_topic) VALUES (?, ?, ?, ?, ?)', [
        req.body.description, 
        data,
        "Open", 
        req.user.id,
        req.body.topic
    ], function (err) {
        if (err) { return next(err); }
        return res.redirect('/my-tickets'); 
    })
});

module.exports = router;