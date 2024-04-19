const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// my-tickets root
router.get('/', async function (req, res, next) {
    if (!req.user) {
        return res.render('my_tickets', {title: "My Tickets", user: req.user});
    }

    try {
        const num_tickets = await db.numberOfTicketsOpenByUserById(req.user.id);

        if (num_tickets == 0) {
            return res.render('my_tickets', {title: "My Tickets", user: req.user, num_tickets: num_tickets});
        }

        // get all user tickets
        const tickets = await db.allOpenTicketsUserByUserId(req.user.id);

        return res.render('my_tickets', {
            title: "My Tickets",
            user: req.user,
            num_tickets: num_tickets,
            tickets: tickets
        });
    } catch (err) {
        console.error("Error getting user tickets:", err);
        // Render an error page or message to the user
    }
});

module.exports = router;