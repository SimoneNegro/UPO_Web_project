const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    if (!req.user) {
        console.log("Access denied to Dashboard: you are not logged in\n");
        return res.redirect('/');
    }
    
    try {
        const type = await db.getUserRole(req.user.email);

        console.log("Correct routing page: Dashboard\n");
        return res.render('user_dashboard', { title: 'Dashboard', user: req.user, type: type });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;