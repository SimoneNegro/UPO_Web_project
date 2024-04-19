const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const {isStaff, isAdmin} = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        return res.redirect('/');
    }

    try {
        const num_tickets = await db.numberOfManagedTicket(req.user.id);
        const managed_ticket = await db.managedTicket(req.user.id);
        return res.render('admin/dashboard', {
            title: 'Ticket Dashboard',
            user: req.user,
            num_tickets: num_tickets,
            managed_ticket: managed_ticket
        });
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

router.post('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        return res.redirect('/');
    }

    try {
        let data = Math.floor(new Date().getTime() / 1000.0);

        switch (req.body.operation_type) {
            case "Transfer Ticket":
                await db.updateTicketStatusWaitingTransfer(req.body.ticket_id);
                break;
            case "Solve Ticket":
                await db.updateTicketStatusSolved(req.body.ticket_id);
                await db.updateCloseDateTicket(req.body.ticket_id, data);
                break;
            case "Close Ticket":
                await db.updateTicketStatusClosed(req.body.ticket_id);
                await db.updateCloseDateTicket(req.body.ticket_id, data);
                break;
            case "Cancel Ticket":
                await db.updateTicketStatusCancelled(req.body.ticket_id);
                await db.updateCloseDateTicket(req.body.ticket_id, data);
                break;
            default :
                console.log("Error: invalid operation type");
                return res.redirect('/dashboard');
        }
        return res.redirect('/closed_tickets');
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;