// I use DBeaver with a sqlite database
const sqlite3 = require('sqlite3').verbose();

// create new instance of SQLite database
const db = new sqlite3.Database('./databases/helpdesk.db', (err) => {
    if (err) {
        console.error('Error during database opening:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

module.exports = db;