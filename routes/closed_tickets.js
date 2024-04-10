const express = require('express');
const router = express.Router();
const {isStaff} = require('../public/js/auth');

const DataBase = require("../db"); // db.js
const db = new DataBase();


router.get('/', async function (req, res, next) {
    if (!isStaff(req)) {
        return res.redirect('/');
    }

    try {
        const num_closed_tickets = await db.numberOfClosedTickets(req.user.id);
        const resolved_tickets = await db.resolvedTickets(req.user.id);
        const closed_tickets = await db.closedTickets(req.user.id);
        const cancelled_tickets = await db.cancelledTickets(req.user.id);

        return res.render('admin/closed_tickets', {
            title: "Closed Tickets",
            user: req.user,
            num_closed_tickets: num_closed_tickets,
            resolved_tickets: resolved_tickets,
            closed_tickets: closed_tickets,
            cancelled_tickets: cancelled_tickets
        });
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;