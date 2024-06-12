const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const DataBase = require("../db");
const db = new DataBase();
const { isStaff, isAdmin } = require('../public/js/auth');

router.use(methodOverride('_method'));

router.get('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Update Frequent Questions: you are not an admin or a staff member\n");
        return res.redirect('/');
    }

    try {
        const all_questions = await db.allFrequentQuestions();
        const all_topics = await db.allTicketTopics();

        console.log("Correct routing page: Update Frequent Questions\n");
        return res.render('super_admin/update_frequent_question', {
            title: 'Update Frequent Questions',
            user: req.user,
            all_questions: all_questions,
            all_topics: all_topics
        });
    } catch (err) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Update Frequent Questions: you are not an admin or a staff member\n");
        return res.redirect('/');
    }

    try {
        await db.addNewQuestion(req.body.topic, req.body.description, req.body.title, req.user.id);

        console.log("Added new frequent question");
        return res.redirect('/update-frequent-question');
    } catch (err) {
        console.error("Error:", err);
    }
});

router.delete('/:id', async function (req, res, next) {
    // to test
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Update Frequent Questions: you are not an admin or a staff member\n");
        return res.redirect('/');
    }

    try {
        await db.deleteQuestion(req.params.id);

        console.log("Deleted Frequent Question");
        return res.redirect('/update-frequent-question');
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;