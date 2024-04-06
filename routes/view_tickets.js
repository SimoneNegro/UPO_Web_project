const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isStaff } = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isStaff(req)) { return res.redirect('/'); }

    try {
        const tickets = await db.allOpenTickets();
        return res.render('admin/view_tickets', { title: "View Tickets", user: req.user, tickets: tickets});
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

router.post('/', function (req, res, next) {
    if (!isStaff(req)) { return res.redirect('/'); }
    console.log(req.body.ticket_id);
    // try {

    // } catch (err) {

    // }
});

module.exports = router;