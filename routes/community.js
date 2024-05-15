const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * perPage;
    let likedContents;
    try {
        const aus = await db.countAllCommunityTickets();
        const totalDescriptions = aus.num_comment;
        const totalPages = Math.ceil(totalDescriptions / perPage);
        const descriptions = await db.getAllCommunityTickets(perPage, offset);
        if(req.user) {
            likedContents = await db.likedContent(req.user.id);
        }
        return res.render('community', {
            title: 'Community',
            user: req.user,
            totalDescriptions: totalDescriptions,
            totalPages: totalPages,
            descriptions: descriptions,
            currentPage: page,
            likedContents: likedContents
        });
    } catch (error) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {

});

module.exports = router;