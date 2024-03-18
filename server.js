// Rimuovi questa linea se non stai utilizzando 'morgan' per il logging
const logger = require('morgan');
const express = require('express');
const flash = require('connect-flash');
const app = express();
const port = 3000;
const config = require('./config.json');

// Importa i router delle rotte
const signupRouter = require('./routes/signup');
const homeRouter = require('./routes/home');
const loginRouter = require('./routes/login');
const forgotpasswordRouter = require('./routes/forgot_password');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
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

// Configura i middleware
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura la sessione
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}));

// Configura Passport
app.use(passport.session());

// Configura la strategia di autenticazione locale di Passport
passport.use(new LocalStrategy(function(email, password, done) {
    db.get('SELECT * FROM utente WHERE email = ?', [email], function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Incorrect username or password.' }); }
        
        crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return done(err); }
            if (!crypto.timingSafeEqual(Buffer.from(user.password, 'binary'), hashedPassword)) {
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            return done(null, user);
        });
    });
}));

// Serializzazione dell'utente
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Deserializzazione dell'utente
passport.deserializeUser(function(id, done) {
    db.get('SELECT * FROM utente WHERE id = ?', [id], function(err, user) {
        if (err) { return done(err); }
        done(null, user);
    });
});

// Utilizza i router per le rotte
app.use('/', homeRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);

// Gestione del logout
app.post('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// DA METTERE IN FORGOT PASSWORD
app.post('/forgot-password', function (req, res, next) {
    db.get('SELECT * FROM utente WHERE email = ?', [req.body.email], function (err, results, fields) {
        if (err) { return next(err); }

        if (results == undefined) { return res.redirect('/forgot-password?error=email_not_exists'); }
        // redir to code link
    });
});

// Gestione degli errori 404
app.use(function(req, res, next) {
    res.status(404).send('<h1>Error 404: Resource not found</h1>');
});

// Avvia il server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
