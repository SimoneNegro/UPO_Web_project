const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isAdmin } = require('../public/js/auth');

router.use(methodOverride('_method'));

router.get('/', async function (req, res, next) {
    if (!isAdmin(req)) {
        console.log("Access denied to Update User: you are not an admin\n");
        return res.redirect('/');
    }

    try {
        const mail = req.query['email'];
        let searched_user;

        if (mail)
            searched_user = await db.searchUserByUserEmail(mail);

        const roles = await db.getRoles();
        const all_users = await db.allUser();

        console.log("Correct routing page: Update User\n");
        return res.render('admin/update_users', {
            title: "Update User",
            user: req.user,
            all_users: all_users,
            searched_user: searched_user,
            roles: roles
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

router.put('/', async function (req, res, next) {
    if (!isAdmin(req)) {
        console.log("Access denied to Update User: you are not an admin\n");
        return res.status(403).json();
    }

    try {
        await db.updateUserRole(req.body.email, req.body.user_type);

        console.log("Updated user role\n");
        return res.redirect('back');
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;