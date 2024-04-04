const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// ticket root
router.get('/', async function (req, res, next) {
    try {
        const topics = await db.allTicketTopics();

        return res.render('ticket', { title: "Open a ticket", user: req.user, topics: topics });
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

router.post('/', async function (req, res, next) {
    try {
        // get date from epoch
        let data = Math.floor(new Date().getTime() / 1000.0);

        await db.addNewTicket(req.body.description, data, req.user.id, req.body.topic);
        return res.redirect('/my-tickets');
        
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;