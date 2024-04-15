const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// cookie_policy root
router.get('/', async function (req, res, next) {
    if (!req.user) {
        return res.render('closed_tickets_user', {title: "Closed Tickets", user: req.user});
    }

    try {
        const closed_tickets = await db.closedTicketsUser(req.user.id);

        return res.render('closed_tickets_user', {
            title: "Closed Tickets",
            user: req.user,
            closed_tickets: closed_tickets
        });
    } catch (err) {
        console.error("Error getting user tickets:", err);
        // Render an error page or message to the user
    }
});

module.exports = router;