const express = require('express');
const app = express();
const port = 3000;
const config = require('./config.json');

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

// Verifica e usa username e password per eseguire il login
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

// acces to home page
app.get('/', (req, res, next) => {
    res.render('home');
});

// acces to reset password
app.get('/forgot', (req, res, next) => {
    res.render('forgot_password');
});

// Richiesta alla pagina di login
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

// signup root
app.get('/signup', function (req, res, next) {
    res.render('signup');
});

// execute users signup
app.post('/signup', function(req, res, next) {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      db.run('INSERT INTO utente (email, password, tipo, salt) VALUES (?, ?, ?, ?)', [
        req.body.email,
        hashedPassword,
        "utente",
        salt
      ], function(err) {
        if (err) { return next(err); }
        var user = {
          id: this.lastID,
          username: req.body.username
        };
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    });
  });

//----------------------------------------------------------------------------------------------------
// LISTEN (START APP)
//----------------------------------------------------------------------------------------------------

// Si mette in ascolto sulla porta 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

