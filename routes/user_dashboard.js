const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

// cookie_policy root
router.get('/', async function (req, res, next) {
    try {
        if (!req.user) {
            return res.redirect('/');
        }
        const type = await db.getUserRole(req.user.email);
        return res.render('user_dashboard', { title: 'Dashboard', user: req.user, type: type });
    } catch (err) {
        console.error(err);
        // TODO
    }
});

module.exports = router;