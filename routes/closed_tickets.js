const express = require('express');
const router = express.Router();
const {isStaff, isAdmin} = require('../public/js/auth');

const DataBase = require("../db"); // db.js
const db = new DataBase();


router.get('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Closed Ticket (admin): you are not a staff or admin member or you are not logged in\n");
        return res.redirect('/');
    }

    try {
        const mail = req.query['email'];
        let searched_tickets;

        if (mail)
            searched_tickets = await db.closedTicketByMailUser(req.user.id, mail);

        const num_closed_tickets = await db.numberOfClosedTickets(req.user.id);
        const resolved_tickets = await db.resolvedTickets(req.user.id);
        const closed_tickets = await db.closedTickets(req.user.id);
        const cancelled_tickets = await db.cancelledTickets(req.user.id);

        console.log("Correct routing page: Closed Ticket (staff)\n");
        return res.render('staff/closed_tickets', {
            title: "Closed Tickets",
            user: req.user,
            searched_tickets: searched_tickets,
            num_closed_tickets: num_closed_tickets,
            resolved_tickets: resolved_tickets,
            closed_tickets: closed_tickets,
            cancelled_tickets: cancelled_tickets
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;