const express = require('express');
const router = express.Router();
const db = require('../db');

const jwt = require("jsonwebtoken"); // generate JWT tokens
const jwt_decode = require("jwt-decode"); // decode JWT token


// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }