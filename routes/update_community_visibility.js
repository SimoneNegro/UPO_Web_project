const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');

const DataBase = require("../db");
const db = new DataBase();

const { isAdmin } = require('../public/js/auth');

router.use(methodOverride('_method'));

router.get('/', async function (req, res, next) {
    try {
        if (!isAdmin(req))
            return res.redirect('/');

        const description = req.query['description'];
        let searchedComment;

        if (description)
            searchedComment = await db.getCommentByTicketDescription(description);

        const allComments = await db.allCommunityComment();
        return res.render('super_admin/update_community_visibility', {
            title: 'Update Community Comment Visibility',
            user: req.user,
            searchedComment: searchedComment,
            allComments: allComments
        });
    } catch (error) {
        console.log("Errore: " + error);
    }
});

router.put('/', async function (req, res, next) {
    try {
        if (!isAdmin(req)) 
            return res.status(403).json();

        if(req.body.visibility == 1)
            await db.updateCommentVisibilityTrue(req.body.id);
        else if(req.body.visibility == 0)
            await db.updateCommentVisibilityFalse(req.body.id);

        res.redirect('back');
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;