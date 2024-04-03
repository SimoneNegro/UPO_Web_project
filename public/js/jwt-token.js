const DataBase = require("../../db"); // db.js
const db = new DataBase();

const jwt = require("jsonwebtoken"); // generate JWT tokens
// const jwt_decode = require("jwt-decode"); // decode JWT token

function generateToken(user_id) {
    return jwt.sign(
        {
            user_id,
            iat: Math.floor(new Date().getTime() / 1000)
        },
        process.env.TOKEN_KEY,
        { expiresIn: "1h" }
    );
}

module.exports = { generateToken };