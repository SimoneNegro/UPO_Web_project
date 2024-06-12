const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    if (!req.user) {
        console.log("Access denied to My Tickets: you are not logged in\n");
        return res.render('my_tickets', { title: "My Tickets", user: req.user });
    }

    try {
        const num_tickets = await db.numberOfTicketsOpenByUserById(req.user.id);

        if (num_tickets == 0) {
            console.log("Correct routing page: My Tickets (with no tickets)\n");
            return res.render('my_tickets', {
                title: "My Tickets",
                user: req.user,
                num_tickets: num_tickets
            });
        }

        const tickets = await db.allOpenTicketsUserByUserId(req.user.id);

        console.log("Correct routing page: My Tickets (with tickets)\n");
        return res.render('my_tickets', {
            title: "My Tickets",
            user: req.user,
            num_tickets: num_tickets,
            tickets: tickets
        });
    } catch (err) {
        console.error("Error getting user tickets:", err);
    }
});

module.exports = router;