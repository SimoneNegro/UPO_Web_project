const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

// const { userId } = require('../public/js/jwt-token');
const { isStaff, isAdmin } = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Update Frequent Questions: you are not an admin or a staff member\n");
        return res.redirect('/');
    }

    try {
        const tickets = await db.allOpenTickets(req.user.id);
        const num_tickets = await db.numberOfManagedTicket(req.user.id);

        console.log("Correct routing page: View Tickets\n");
        return res.render('admin/view_tickets', {
            title: "View Tickets",
            user: req.user,
            tickets: tickets,
            num_tickets: num_tickets
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Update Frequent Questions: you are not an admin or a staff member\n");
        return res.redirect('/');
    }

    try {
        let data = Math.floor(new Date().getTime() / 1000.0);

        await db.addManageTicket(req.user.id, req.body.ticket_id, data);
        await db.updateTicketStatusInProgress(req.body.ticket_id);

        console.log("Assigned ticket to a staff member\n");
        return res.redirect('/dashboard');
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;