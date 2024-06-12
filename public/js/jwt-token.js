const DataBase = require("../../db"); // db.js
const db = new DataBase();

const jwt = require("jsonwebtoken"); // generate JWT tokens
// const jwt_decode = require("jwt-decode"); // decode JWT token

/**
 * Generate a JWT token with the specified payload. Session token expires in one hour.
 * @param {int} user_id User id.
 * @returns Token.
 */
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

// getRole(24)
//   .then(role => console.log("User role:", role.tipo)) 
//   .catch(err => console.error("Error getting user role:", err));
module.exports = { generateToken };