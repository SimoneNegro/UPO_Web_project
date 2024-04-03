// i use DBeaver with a sqlite database
const sqlite3 = require('sqlite3').verbose();
let db;

// @see {@link github_link }

/**
 * Create a database class using specified functions
 * @author BeastOfShadow 
 */
class DataBase {
    /**
     * Open connection to database
     */
    open() {
        db = new sqlite3.Database('./databases/helpdesk.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.error('Error during database opening:', err.message);
            else console.log('Connected to SQLite database.');
        });
    }

    /**
     * Close connection to database
     */
    close() {
        db.close((err) => {
            if (err) throw console.error(err.message);
        });
    }

    /**
     * Search user by email address.
     * @param {String} email - Email address.
     * @returns User if found or null if not found.
     */
    findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM utente WHERE email = ?`;

            this.open();
            db.get(sql, [email], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Search user by id.
     * @param {int} id - User id.
     * @returns User if found or null if not found.
     */
    findUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM utente WHERE id = ?`;

            this.open();
            db.get(sql, [id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Count the number of tickets opened by a specified user.
     * @param {int} id - User id. 
     * @returns Number of tickets opened by user.
     */
    numberOfTicketsOpenByUserById(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS num_user_ticket FROM ticket t INNER JOIN utente u ON t.id_utente = u.id WHERE u.id = ?`;

            this.open();
            db.get(sql, [id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all tickets opened by a specified user.
     * @param {int} id User id. 
     * @returns All user tickets.
     */
    allUserTicketsByUserId(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM ticket WHERE id_utente = ?`;

            this.open();
            db.all(sql, [id], (err, rows) => {
                if (err) throw reject(err);
                resolve(rows);
            });
            this.close();
        });
    }
}

// create new instance of SQLite database
module.exports = DataBase;