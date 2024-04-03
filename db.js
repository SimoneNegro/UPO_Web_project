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
     * @param {int} id - User id. 
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

    /**
     * Add new user into database.
     * @param {String} email - User email.
     * @param {String} password - User password.
     * @returns Returns true if successful or false if failed.
     */
    addNewUser(email, password) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO utente (email, password, tipo) VALUES (?, ?, ?)`;

            this.open();
            // insert user type into function to prevent inject attacks
            db.run(sql, [email, password, "utente"], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * 
     * @param {int} user_id User id.
     * @param {String} token Generated user token.
     * @returns 
     */
    addTokenToUser(user_id, token) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE utente SET token = ? WHERE id = ?`;

            this.open();
            db.run(sql, [token, user_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all topics from database.
     * @returns All topics.
     */
    allTicketTopics() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM topic`;

            this.open();
            db.all(sql, [], (err, rows) => {
                if (err) throw reject(err);
                resolve(rows);
            });
            this.close();
        });
    }

    /**
     * Add new ticket opened by user.
     * @param {String} description - Ticket description.
     * @param {*} data - Ticket open data.
     * @param {*} user_id - User id.
     * @param {*} topic - Ticket topic.
     * @returns Returns true if successful or false if failed.
     */
    addNewTicket(description, data, user_id, topic) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ticket (descrizione, data_apertura, stato, id_utente, nome_topic) VALUES (?, ?, ?, ?, ?)`;

            this.open();
            db.run(sql, [description, data, "Open", user_id, topic], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }
}

// create new instance of SQLite database
module.exports = DataBase;