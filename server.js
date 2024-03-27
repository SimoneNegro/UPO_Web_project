const logger = require('morgan');
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

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('./db');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');

//----------------------------------------------------------------------------------------------------
// SET
//----------------------------------------------------------------------------------------------------
app.set('view engine', 'ejs');

//----------------------------------------------------------------------------------------------------
// USE
//----------------------------------------------------------------------------------------------------

// middleware configuration
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sessione configuration
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

// passport configuration
app.use(passport.session());

// user authentication
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function (email, password, done) {
    db.get('SELECT * FROM utente WHERE email = ?', [email], function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) { return done(err); }
            if (result) { return done(null, user); }
            else { return done(null, false); }
        });
    });
}));

// user serialization
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// user deserialization
passport.deserializeUser(function (id, done) {
    db.get('SELECT * FROM utente WHERE id = ?', [id], function (err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
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

// Gestione del logout
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// DA METTERE IN FORGOT PASSWORD
app.post('/forgot-password', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {
        if (err) { return next(err); }

        if (results == undefined) { return res.redirect('/forgot-password?error=email_not_exists'); }
        // redir to code link
    });
});

// error 404 response
app.use(function (req, res, next) {
    res.status(404).send('<h1>Error 404: Resource not found</h1>');
});

// sever start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
