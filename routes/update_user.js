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
        const mail = req.query['email'];
        let searched_user;

        if (mail) {
            searched_user = await db.searchUserByUserEmail(mail);
        }

        const all_users = await db.allUser();
        return res.render('super_admin/update_users', {title: "Update User", user: req.user, all_users: all_users, searched_user: searched_user});
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;