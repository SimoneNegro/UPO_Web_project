// I use DBeaver with a sqlite database
const sqlite3 = require('sqlite3').verbose();

// Creazione di una nuova istanza del database SQLite
const db = new sqlite3.Database('./databases/helpdesk.db', (err) => {
    if (err) {
        console.error('Errore durante l\'apertura del database:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
    }
});

module.exports = db;