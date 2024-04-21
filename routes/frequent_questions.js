const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const DataBase = require("../db");
const {generateToken} = require("../public/js/jwt-token"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    try {
        const sw_question = await db.softwareQuestion();
        const hw_question = await db.hardwareQuestion();
        const o_question = await db.otherQuestion();
        return res.render('frequent_questions', {
            title: 'Frequent Questions',
            user: req.user,
            sw_question: sw_question,
            hw_question: hw_question,
            o_question: o_question
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;