const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const {isAdmin} = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isAdmin(req)) {
        return res.redirect('/');
    }

    try {
        return res.render('super_admin/super_admin', {title: "Admin panel", user: req.user});
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;