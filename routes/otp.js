const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();

// otp root
router.get('/', async function (req, res, next) {
    try {
        let error;
        if (req.query.error !== undefined) {
            error = req.query.error;
        }
        return res.render('otp', {uuid: req.query, error: error});
    } catch (err) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const user_db_otp = await db.getUserIdByUuid(req.body.uuid);
        const current_date = Math.floor(new Date().getTime() / 1000.0);
        if ((user_db_otp.date + 86400) < current_date) {
            return res.redirect('otp?code=' + req.body.uuid + '&error=expired_otp');
        } else if (user_db_otp.otp.toString() !== req.body.otp) {
            return res.redirect('otp?code=' + req.body.uuid + '&error=invalid_otp');
        } else {
            req.session.user_id = user_db_otp.user_id;
            return res.redirect('change-password');
        }
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;