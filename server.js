if (process.env.NODE_ENV !== "production") {
    require("dotenv").config(); // load .env file
}

const express = require('express');
const flash = require('connect-flash');
const app = express();
const port = 3000;
const config = require('./config.json');

// import router files
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const forgotpasswordRouter = require('./routes/forgot_password');
const termofserviceRouter = require('./routes/term_of_service');
const cookiepolicyRouter = require('./routes/cookie_policy');
const privacypolicyRouter = require('./routes/privacy_policy');
const ticketRouter = require('./routes/ticket');
const myTicketsRouter = require('./routes/my_tickets');
const otpRouter = require('./routes/otp');
const closedUserTicketsRouter = require('./routes/closed_tickets_user');
const userDashboardRouter = require('./routes/user_dashboard');
const changePasswordRouter = require('./routes/change_password');
const frequentQuestionRouter = require('./routes/frequent_questions');
const communityRouter = require('./routes/community');
// staff routes
const staffRouter = require('./routes/staff');
const closedTicketsRouter = require('./routes/closed_tickets');
const viewTicketsRouter = require('./routes/view_tickets');
const ticketDashboardRouter = require('./routes/dashboard');
// admin routes
const adminRouter = require('./routes/admin');
const adminUpdateUserRouter = require('./routes/update_user');
const adminUpdateFrequentQuestionRouter = require('./routes/update_frequent_question');
const adminUpdateCommunityVisbilityRouter = require('./routes/update_community_visibility');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// const db = require('./db');
const DataBase = require("./db"); // db.js
const db = new DataBase();
const session = require('express-session');
const path = require('path');

//----------------------------------------------------------------------------------------------------
// SET
//----------------------------------------------------------------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//----------------------------------------------------------------------------------------------------
// USE
//----------------------------------------------------------------------------------------------------

// middleware configuration
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// session configuration
app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: false
}));

// passport configuration
app.use(passport.session());

// user authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async function (email, password, done) {
    try {
        const user = await db.findUserByEmail(email);
        // user not found
        if (!user) return done(null, false);
        // hashing password
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) return done(err);
            // password matched
            if (result) return done(null, user);
            // password mismatch
            else return done(null, false);
        });
    } catch (err) {
        // log error
        console.error("Error finding user by email:", err);
        // database error
        return done(err);
    }
}));

// user serialization
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// user deserialization
passport.deserializeUser(async function (id, done) {
    try {
        const user = await db.findUserById(id);
        // user found
        done(null, user);
    } catch (err) {
        // log error
        console.error("Error finding user by id:", err);
        // pass error to Passport 
        done(err);
    }
});

// routers
app.use('/', homeRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/forgot-password', forgotpasswordRouter);
app.use('/terms-of-service', termofserviceRouter);
app.use('/cookie-policy', cookiepolicyRouter);
app.use('/privacy-policy', privacypolicyRouter);
app.use('/open-ticket', ticketRouter);
app.use('/my-tickets', myTicketsRouter);
app.use('/otp', otpRouter);
app.use('/closed-tickets', closedUserTicketsRouter);
app.use('/user-dashboard', userDashboardRouter);
app.use('/change-password', changePasswordRouter);
app.use('/frequent-questions', frequentQuestionRouter);
app.use('/community', communityRouter);

// staff routes
app.use('/staff', staffRouter);
app.use('/closed_tickets', closedTicketsRouter);
app.use('/view_tickets', viewTicketsRouter);
app.use('/dashboard', ticketDashboardRouter);
// admin routes
app.use('/admin', adminRouter);
app.use('/update-user', adminUpdateUserRouter);
app.use('/update-frequent-question', adminUpdateFrequentQuestionRouter);
app.use('/update-community-comment-visibility', adminUpdateCommunityVisbilityRouter);

// logout handler
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// error 404 response
app.use(function (req, res, next) {
    res.status(404).render('page_not_found', { title: 'Resource Not Found', user: req.user });
});

// sever start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
