const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// ticket root
router.get('/', async function (req, res, next) {
    // ADD IS NOT IN STAFF ROUTING
    const err_ticket_text = 0;

    try {
        const topics = await db.allTicketTopics();

        return res.render('ticket', { title: "Open a ticket", user: req.user, topics: topics, err_ticket_text: err_ticket_text});
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

router.post('/', async function (req, res, next) {
    try {
        // get date from epoch
        let data = Math.floor(new Date().getTime() / 1000.0);
        const err_ticket_text = await db.invalidTicketText(req.body.description);

        if(err_ticket_text.invalid_text > 0) {
            const topics = await db.allTicketTopics();

            return res.render('ticket', { title: "Open a ticket", user: req.user, topics: topics, err_ticket_text: err_ticket_text });
        }

        await db.addNewTicket(req.body.description, data, req.user.id, req.body.topic);
        return res.redirect('/my-tickets');
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;