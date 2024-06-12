const express = require('express');
const router = express.Router();
const DataBase = require("../db"); // db.js
const db = new DataBase();
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const { v4: uuidv4 } = require('uuid');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    }
});

router.get('/', function (req, res, next) {
    let errorMessage;
    if (req.query.error !== undefined)
        errorMessage = "Email do not exist."

    console.log("Email does not exist");
    return res.render('forgot_password', { message: errorMessage, user: req.user });
});

router.post('/', async function (req, res, next) {
    try {
        const user = await db.findUserByEmail(req.body.email);
        if (!user) {
            console.log("Email does not exist");
            return res.redirect('/forgot-password?error=email_not_exist');
        }

        const otp_code = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false
        });
        const uuid = uuidv4();
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: req.body.email,
            subject: 'Forgot password',
            html: 'Otp code: ' + otp_code + '. Click  <a href="http://localhost:3000/otp?code=' + uuid + '">here</a> to reset password'
        };

        const user_id = await db.getUserId(req.body.email);
        let current_date = Math.floor(new Date().getTime() / 1000.0);
        await db.otpCodeAssignment(user_id.id, otp_code, current_date, uuid);

        await transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
            }
        });

        console.log("OTP sent by email");
        return res.redirect('otp?code=' + uuid);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;