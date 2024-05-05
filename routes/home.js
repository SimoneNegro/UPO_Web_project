const express = require('express');
const router = express.Router();

const {isStaff} = require('../public/js/auth');

// home root
// add isStaff and isAdmin
router.get('/', function (req, res, next) {
    if(isStaff(req)) 
        return res.redirect('/admin');
    
    return res.render('home', {title: "NGR", user: req.user});
});

module.exports = router;