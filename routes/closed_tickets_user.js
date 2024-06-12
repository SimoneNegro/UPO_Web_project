const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    if (!req.user) {
        console.log("Access denied to Closed Tickets: you are not logged in\n");
        return res.render('closed_tickets_user', {title: "Closed Tickets", user: req.user});
    }

    try {
        const closed_tickets = await db.closedTicketsUser(req.user.id);

        console.log("Correct routing page: Closed Ticket\n");
        return res.render('closed_tickets_user', {
            title: "Closed Tickets",
            user: req.user,
            closed_tickets: closed_tickets
        });
    } catch (err) {
        console.error("Error getting user tickets:", err);
    }
});

module.exports = router;