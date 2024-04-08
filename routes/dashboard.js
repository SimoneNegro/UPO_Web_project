const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isStaff } = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isStaff(req)) { return res.redirect('/'); }

    try {
        const num_tickets = await db.numberOfManagedTicket(req.user.id);
        return res.render('admin/dashboard', { title: 'Ticket Dashboard', user: req.user, num_tickets: num_tickets });
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;