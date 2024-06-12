const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isStaff } = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if(isStaff(req)) {
        console.log("Access denied to Open a ticket: you are not an admin or a user\n");
        return res.redirect('/');
    }

    const err_ticket_text = 0;

    try {
        const topics = await db.allTicketTopics();

        console.log("Correct routing page: Open a ticket\n");
        return res.render('ticket', {
            title: "Open a ticket",
            user: req.user,
            topics: topics,
            err_ticket_text: err_ticket_text
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        // get date from epoch
        let data = Math.floor(new Date().getTime() / 1000.0);
        const err_ticket_text = await db.invalidTicketText(req.body.description);

        if (err_ticket_text.invalid_text > 0) {
            const topics = await db.allTicketTopics();

            console.log("Error: invalid ticket description\n");
            return res.render('ticket', {
                title: "Open a ticket",
                user: req.user,
                topics: topics,
                err_ticket_text: err_ticket_text
            });
        }

        await db.addNewTicket(req.body.description, data, req.user.id, req.body.topic);

        console.log("New ticket successfully opened\n");
        return res.redirect('/my-tickets');
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;