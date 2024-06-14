const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isAdmin } = require('../public/js/auth');

router.get('/', async function (req, res, next) {
    if (!isAdmin(req)) {
        console.log("Access denied to Admin panel: you are not an admin\n");
        return res.redirect('/');
    }

    try {
        console.log("Correct routing page: Admin panel\n");
        return res.render('admin/super_admin', { title: "Admin panel", user: req.user });
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;