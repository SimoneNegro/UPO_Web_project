const db = require('./db');
const email = "luca@l";

db.get('SELECT * FROM utente WHERE email = ?', [email], function (err, user) {
    console.log(err);
    console.log(user);
    console.log(user.password);
});