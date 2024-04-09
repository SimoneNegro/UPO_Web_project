// I use DBeaver with a sqlite database
const sqlite3 = require('sqlite3').verbose();
let db;

// @see {@link github_link }

/**
 * Create a database class using specified functions
 * @author BeastOfShadow
 */
class DataBase {
    /**
     * Open connection to database.
     */
    open() {
        db = new sqlite3.Database('./databases/helpdesk.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.error('Error during database opening:', err.message);
            else console.log('Connected to SQLite database.');
        });
    }

    /**
     * Close connection to database.
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
            const sql = `SELECT *
                         FROM utente
                         WHERE email = ?`;

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
            const sql = `SELECT *
                         FROM utente
                         WHERE id = ?`;

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
            const sql = `SELECT COUNT(*) AS num_user_ticket
                         FROM ticket t
                                  INNER JOIN utente u ON t.id_utente = u.id
                         WHERE u.id = ?`;

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
            const sql = `SELECT *
                         FROM ticket
                         WHERE id_utente = ?`;

            this.open();
            db.all(sql, [id], (err, rows) => {
                if (err) throw reject(err);
                resolve(rows);
            });
            this.close();
        });
    }

    /**
     * Return all tickets with Open status ordered by open date (first opened, more priorities)
     * @returns All open tickets.
     */
    allOpenTickets() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM ticket
                         WHERE stato LIKE 'Pending'
                            OR stato LIKE 'Waiting Transfer'
                         ORDER BY data_apertura ASC`;

            this.open();
            db.all(sql, [], (err, rows) => {
                if (err) throw reject(err);
                resolve(rows);
            });
            this.close();
        });
    }

    /* TICKET STATUS 
        New:
        Pending: new ticket waiting to be managed;
        Waiting Transfer: waiting to be transferred to another staff member;
        In Progress: staff member opened the ticket; 
        Resolved: staff member solved problem;
        Closed: staff member can't solve this problem;
        Cancelled: staff member cancelled the ticket because not a real issue.
    */

    /**
     * Update ticket status to "In Progress".
     * @param {int} ticket_id Ticket id.
     * @returns Returns true if successful or false if failed.
     */
    updateTicketStatusInProgress(ticket_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket
                         SET stato='In Progress'
                         WHERE id = ?`;

            this.open();
            db.run(sql, [ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update ticket status to "Waiting Transfer".
     * @param {int} ticket_id Ticket id.
     * @returns Returns true if successful or false if failed.
     */
    updateTicketStatusWaitingTransfer(ticket_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket
                         SET stato='Waiting Transfer'
                         WHERE id = ?`;

            this.open();
            db.run(sql, [ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update ticket status to "Resolved".
     * @param {int} ticket_id Ticket id.
     * @returns Returns true if successful or false if failed.
     */
    updateTicketStatusSolved(ticket_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket
                         SET stato='Resolved'
                         WHERE id = ?`;

            this.open();
            db.run(sql, [ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update ticket status to "Closed".
     * @param {int} ticket_id Ticket id.
     * @returns Returns true if successful or false if failed.
     */
    updateTicketStatusClosed(ticket_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket
                         SET stato='Closed'
                         WHERE id = ?`;

            this.open();
            db.run(sql, [ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update ticket status to "Cancelled".
     * @param {int} ticket_id Ticket id.
     * @returns Returns true if successful or false if failed.
     */
    updateTicketStatusCancelled(ticket_id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE ticket
                         SET stato='Cancelled'
                         WHERE id = ?`;

            this.open();
            db.run(sql, [ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update closing date ticket.
     * @param {int} ticket_id Ticket id.
     * @param {int} data Close ticket date.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    updateCloseDateTicket(ticket_id, data) {
        return new Promise((resolve, reject) => {
           const sql = `UPDATE ticket
                        SET chiusura_ticket = ?
                        WHERE id = ?`;

            this.open();
            db.run(sql, [data, ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Create a row where is used to see who is currently working on the ticket.
     * @param {int} staff_id Staff id.
     * @param {int} ticket_id Ticket id.
     * @param {int} date Manage ticket date:
     * @returns Returns true if successful or false if failed.
     */
    addManageTicket(staff_id, ticket_id, date) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO gestisce (id_admin, id_ticket, data_gestione_ticket)
                         VALUES (?, ?, ?)`;

            this.open();
            db.run(sql, [staff_id, ticket_id, date], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return ticket that are managed by a staff user and return some fundamental parameter.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} Managed ticket and user information (ticket id, ticket topic, ticket description and user email).
     */
    managedTicket(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT t.id, t.nome_topic, t.descrizione, u.email
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                                  INNER JOIN utente u ON t.id_utente = u.id
                         WHERE g.id_admin = ?
                           AND t.stato = 'In Progress'`;

            this.open();
            db.get(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
        });
    }

    /**
     * Count the number of ticket managed by a staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} Number of managed ticket.
     */
    numberOfManagedTicket(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) num_managed_ticket
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                         WHERE g.id_admin = ?
                           AND t.stato = 'In Progress'`;

            this.open();
            db.get(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
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
            const sql = `INSERT INTO utente (email, password, tipo)
                         VALUES (?, ?, ?)`;

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
     * Add token to the user.
     * @param {int} user_id User id.
     * @param {String} token Generated user token.
     * @returns Returns true if successful or false if failed.
     */
    addTokenToUser(user_id, token) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE utente
                         SET token = ?
                         WHERE id = ?`;

            this.open();
            db.run(sql, [token, user_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    // getRole(user_id) {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT tipo FROM utente WHERE id = ?`;
    //         this.open();
    //         db.get(sql, [user_id], (err, row) => {
    //             if (err) throw reject(err);
    //             resolve(row);
    //         });
    //         this.close();
    //     });
    // }

    /**
     * Return all topics from database.
     * @returns All topics.
     */
    allTicketTopics() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM topic`;

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
     * @param {int} data - Ticket open data.
     * @param {int} user_id - User id.
     * @param {String} topic - Ticket topic.
     * @returns Returns true if successful or false if failed.
     */
    addNewTicket(description, data, user_id, topic) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO ticket (descrizione, data_apertura, stato, id_utente, nome_topic)
                         VALUES (?, ?, ?, ?, ?)`;

            this.open();
            db.run(sql, [description, data, "Pending", user_id, topic], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }
}

// create new instance of SQLite database
module.exports = DataBase;