const express = require('express');
const router = express.Router();
const {isStaff} = require('../public/js/auth');

const DataBase = require("../db"); // db.js
const db = new DataBase();

router.get('/', async function (req, res, next) {
    if (isStaff(req)) {
        return res.redirect('/');
    }
    
    try {
        const perPage = 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * perPage;
        const description_query = req.query['description'];
        let likedContents, searched_content;

        let aus, totalDescriptions, totalPages, descriptions;

        if(description_query) {
            searched_content = await db.getSearchedCommunityTicket(description_query, perPage, offset);
            aus = await db.countAllSearchedCommunityTickets(description_query);
            totalDescriptions = aus.num_comment;
            totalPages = Math.ceil(totalDescriptions / perPage);
            // descriptions = await db.getAllCommunityTickets(perPage, offset);
        } else {
            aus = await db.countAllCommunityTickets();
            totalDescriptions = aus.num_comment;
            totalPages = Math.ceil(totalDescriptions / perPage);
            descriptions = await db.getAllCommunityTickets(perPage, offset);
        }

        if (req.user) 
            likedContents = await db.likedContent(req.user.id);

        return res.render('community', {
            title: 'Community',
            user: req.user,
            totalDescriptions: totalDescriptions,
            totalPages: totalPages,
            descriptions: descriptions,
            currentPage: page,
            likedContents: likedContents,
            searched_content: searched_content,
            description_query: description_query
        });
    } catch (error) {
        console.error("Error:", err);
    }
});

router.post('/', async function (req, res, next) {
    if (isStaff(req)) {
        return res.redirect('/');
    }

    
});

module.exports = router;