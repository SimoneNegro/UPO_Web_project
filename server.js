const express = require('express');
const app = express();
const port = 3000;
const config = require('./config.json');
const router = express.Router();

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('./db');
var logger = require('morgan');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var path = require('path');

//----------------------------------------------------------------------------------------------------
// SET
//----------------------------------------------------------------------------------------------------

app.set('view engine', 'ejs');

//----------------------------------------------------------------------------------------------------
// USE
//----------------------------------------------------------------------------------------------------

// verify and use username and password to perform the login
passport.use(new LocalStrategy(function verify(email, password, cb) {
    db.get('SELECT * FROM utente WHERE mail = ?', [email], function (err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));

// static file roots
app.use(express.static(path.join(__dirname, 'public')));

// json serialization
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// session config
app.use(session({
    // key saved in json file
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './databases/' })
}));

// how passport create session
app.use(passport.authenticate('session'));

// session serialization
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email });
    });
});

// session deserialization
passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

//----------------------------------------------------------------------------------------------------
// HTTP METHODS
//----------------------------------------------------------------------------------------------------

// access to home page
app.get('/', (req, res, next) => {
    res.render('home');
});

// login root
app.get('/login', (req, res, next) => {
    res.render('login');
});

// password root
app.post('/login/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

// logout root
app.post('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// forgot password root
app.get('/forgot-password', (req, res, next) => {
    if (req.body.error === 'email_not_exists')
        return res.render('forgot_password', { message: 'Email does not exist.' });

    res.render('forgot_password');
});

// signup root
app.get('/signup', function (req, res, next) {
    const errorMessage = req.session.errorMessage;
    // clean error message session
    req.session.errorMessage = null; 

    res.render('signup', { message: errorMessage });
});

// execute users signup
app.post('/signup', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {

        if (results != undefined) {
            // create a session error for root function
            req.session.errorMessage = 'Email already exists.';
            return res.redirect('/signup');
        }

        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return next(err); }

            if (err) { return next(err); }
            db.run('INSERT INTO utente (email, password, tipo, salt) VALUES (?, ?, ?, ?)', [
                req.body.email,
                hashedPassword,
                "utente",
                salt
            ], function (err) {
                if (err) { return next(err); }
                var user = {
                    id: this.lastID,
                    username: req.body.username
                };
                req.login(user, function (err) {
                    if (err) { return next(err); }
                    res.redirect('/');
                });
            });
        });
    });
});

app.post('/forgot-password', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {
        if (err) { return next(err); }

        if (results == undefined) { return res.redirect('/forgot-password?error=email_not_exists'); }
        // redir to code link
    });
});

//----------------------------------------------------------------------------------------------------
// LISTEN (START APP)
//----------------------------------------------------------------------------------------------------

// it listens on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// if page root does not exist, return error 404
app.use((req,res)=>{
    res.status(404)
    res.send('<h1> Error 404: Resource not found</h1>');
})