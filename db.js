// I use DBeaver with a sqlite database
const {text} = require("express");
const sqlite3 = require('sqlite3').verbose();
let db;

/**
 * Create a database class using specified functions.
 * This is a middleware with all database possible actions.
 * GitHub repository name: UPO_Web_project.
 * @author BeastOfShadow
 * @see https://github.com/SimoneNegro
 */
class DataBase {
    /**
     * Open connection to database.
     */
    open() {
        db = new sqlite3.Database('./databases/helpdesk.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) console.error('Error during database opening:', err.message);
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
                         WHERE u.id = ? AND (stato = 'Pending' OR stato = 'Waiting Transfer')`;

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
    allOpenTicketsUserByUserId(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM ticket
                         WHERE id_utente = ?
                           AND (stato = 'Pending' OR stato = 'Waiting Transfer')`;

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
    allOpenTickets(id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM ticket t
                         WHERE t.stato LIKE 'Pending' OR (t.stato LIKE 'Waiting Transfer' AND t.id NOT IN (SELECT id_ticket FROM gestisce WHERE id_admin = ?))
                         ORDER BY t.data_apertura ASC`;

            this.open();
            db.all(sql, [id], (err, rows) => {
                if (err) throw reject(err);
                resolve(rows);
            });
            this.close();
        });
    }

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
     * Update gestisce updating data specified by parameters.
     * @param {int} staff_id Staff id.
     * @param {int} ticket_id Ticket id.
     * @param {String} comment Handled ticket description.
     * @param {int} visible 1 show, 0 don't show.
     * @returns {Promise<unknown>} Returns true if successful or false if failed. 
     */
    closedTicketInformation(staff_id, ticket_id, comment, visible) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE gestisce
                         SET commento = ?, visibile = ? 
                         WHERE id_admin = ? AND id_ticket = ?`;

            this.open();
            db.run(sql, [comment, visible, staff_id, ticket_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    addLike(id_utente, id_gestisce) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO likes(id_utente, id_gestisce)
                         VALUES(?, ?)`;
                        
            this.open();
            db.run(sql, [id_utente, id_gestisce], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    removeLike(id_utente, id_gestisce) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM likes 
                         WHERE id_utente = ? AND id_gestisce = ?`;
                        
            this.open();
            db.run(sql, [id_utente, id_gestisce], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    addLikeGestisce(id_gestisce) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE gestisce 
                         SET like = (like + 1) 
                         WHERE id = ?`;
                        
            this.open();
            db.run(sql, [id_gestisce], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    removeLikeGestisce(id_gestisce) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE gestisce 
                         SET like = (like - 1) 
                         WHERE id = ?`;
                        
            this.open();
            db.run(sql, [id_gestisce], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    getUserLike(id_utente, id_gestisce) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM likes
                         WHERE id_utente = ? AND id_gestisce = ?`;
                        
            this.open();
            db.get(sql, [id_utente, id_gestisce], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    getSearchedCommunityTicket(description, limit, offset) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id, t.descrizione, g.commento, g."like", t.nome_topic, t.chiusura_ticket, t.stato  FROM gestisce g 
                         INNER JOIN ticket t ON g.id_ticket = t.id 
                         WHERE g.visibile = 1 AND t.descrizione LIKE '%' || ? || '%'
                         ORDER BY g."like" DESC
                         LIMIT ?
                         OFFSET ?`;
                        
            this.open();
            db.all(sql, [description, limit, offset], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    countAllSearchedCommunityTickets(description) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS num_comment FROM gestisce g 
                         INNER JOIN ticket t ON g.id_ticket = t.id 
                         WHERE g.visibile = 1 AND t.descrizione LIKE '%' || ? || '%'`;

            this.open();
            db.get(sql, [description], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    getAllCommunityTickets(page, offset) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id, t.descrizione, g.commento, g."like", t.nome_topic, t.chiusura_ticket, t.stato  FROM gestisce g 
                         INNER JOIN ticket t ON g.id_ticket = t.id 
                         WHERE g.visibile = 1
                         ORDER BY g."like" DESC
                         LIMIT ?
                         OFFSET ?`;

            this.open();
            db.all(sql, [page, offset], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    countAllCommunityTickets() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS num_comment FROM gestisce g 
                         INNER JOIN ticket t ON g.id_ticket = t.id 
                         WHERE g.visibile = 1`;

            this.open();
            db.get(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    likedContent(user_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM likes 
                         WHERE id_utente = ?`;

            this.open();
            db.all(sql, [user_id], (err, row) => {
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
     * @param {int} date Manage ticket date.
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
     * Return all closed tickets (with follow states: Cancelled, Closed and Resolved) by a specific user id.
     * @param {int} user_id User id.
     * @returns {Promise<unknown>} All closed tickets.
     */
    closedTicketsUser(user_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT t.id, t.stato, t.descrizione, t.chiusura_ticket
                         FROM ticket t
                         WHERE t.chiusura_ticket NOTNULL AND t.id_utente = ? AND (t.stato = 'Cancelled' OR t.stato = 'Closed' OR t.stato = 'Resolved')
                         ORDER BY t.chiusura_ticket ASC`;

            this.open();
            db.all(sql, [user_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all 'Resolved' tickets made by staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} All solved tickets.
     */
    resolvedTickets(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id_ticket, u.email, t.chiusura_ticket
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                                  INNER JOIN utente u ON u.id = t.id_utente
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ? AND t.stato = 'Resolved'`;

            this.open();
            db.all(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all 'Closed' tickets made by staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} All closed tickets.
     */
    closedTickets(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id_ticket, u.email, t.chiusura_ticket
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                                  INNER JOIN utente u ON u.id = t.id_utente
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ? AND t.stato = 'Closed'`;

            this.open();
            db.all(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all 'Cancelled' tickets made by staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} All cancelled tickets.
     */
    cancelledTickets(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id_ticket, u.email, t.chiusura_ticket
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                                  INNER JOIN utente u ON u.id = t.id_utente
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ? AND t.stato = 'Cancelled'`;

            this.open();
            db.all(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all closed tickets by specif staff user and a specific user email. You can put an uncompleted user mail.
     * @param {int} staff_id Staff id.
     * @param {text} user_mail User email.
     * @returns {Promise<unknown>} All closed tickets.
     */
    closedTicketByMailUser(staff_id, user_mail) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT g.id_ticket, u.email, t.chiusura_ticket, t.stato
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                                  INNER JOIN utente u ON u.id = t.id_utente
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ? AND (t.stato = 'Cancelled' OR t.stato = 'Closed' OR t.stato = 'Resolved') AND u.email LIKE '%' || ? || '%'
                         ORDER BY u.email ASC`;

            this.open();
            db.all(sql, [staff_id, user_mail], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return the number of invalid tickets text by a specific ticket description.
     * @param {text} text User ticket description.
     * @returns {Promise<unknown>} Number of invalid tickets text.
     */
    invalidTicketText(text) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS invalid_text
                         FROM ticket t
                         WHERE t.descrizione = ?
                           AND t.stato = 'Cancelled'
                           AND t.chiusura_ticket NOTNULL`;

            this.open();
            db.get(sql, [text], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Count the number of tickets closed by a staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} Number of closed tickets.
     */
    numberOfClosedTickets(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT COUNT(*) AS closed_tickets
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ?`;

            this.open();
            db.get(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Count all closed tickets by status ticket by a specific staff user.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} Number of closed tickets of all tickets status.
     */
    numClosedTicketsByStatusByStaffUser(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT t.stato, COUNT(*) AS closed_tickets
                         FROM gestisce g
                                  INNER JOIN ticket t ON g.id_ticket = t.id
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ? AND t.stato <> 'In Progress' AND t.stato <> 'Waiting Transfer'
                         GROUP BY t.stato`;
            this.open();
            db.all(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Count all tickets for every month year.
     * @param {int} staff_id Staff id.
     * @returns {Promise<unknown>} Return closed tickets by month.
     */
    closedTicketsLastMonthByStaffUser(staff_id) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT strftime('%m', datetime(t.chiusura_ticket, 'unixepoch')) AS month, COUNT(*) AS num_closed_tickets
                         FROM gestisce g
                             INNER JOIN ticket t
                         ON g.id_ticket = t.id
                         WHERE t.chiusura_ticket NOTNULL AND g.id_admin = ?
                         GROUP BY month`;

            this.open();
            db.all(sql, [staff_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
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
     * Return all frequent questions and all parameter.
     * @returns {Promise<unknown>} Return all frequent questions.
     */
    allFrequentQuestions() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT *
                         FROM domande_frequenti`;

            this.open();
            db.all(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Delete a specif question.
     * @param {int} question_id Question id.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    deleteQuestion(question_id) {
        return new Promise((resolve, reject) => {
           const sql = `DELETE FROM domande_frequenti WHERE id = ?`;

           this.open();
           db.run(sql, [question_id], (err, row) => {
               if (err) throw reject(err);
               resolve(row);
           });
           this.close();
        });
    }

    /**
     * Return all software question.
     * @returns {Promise<unknown>} All software question.
     */
    softwareQuestion() {
        return new Promise((resolve, reject) => {
           const sql = `SELECT descrizione, titolo FROM domande_frequenti WHERE topic = 'Software'`;

           this.open();
           db.all(sql, [], (err, row) => {
              if (err) throw reject(err);
              resolve(row);
           });
           this.close();
        });
    }

    /**
     * Return all hardware question.
     * @returns {Promise<unknown>} All software question.
     */
    hardwareQuestion() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT descrizione, titolo FROM domande_frequenti WHERE topic = 'Hardware'`;

            this.open();
            db.all(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all other question.
     * @returns {Promise<unknown>} All software question.
     */
    otherQuestion() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT descrizione, titolo FROM domande_frequenti WHERE topic = 'Other'`;

            this.open();
            db.all(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all frequent question.
     * @param {text} description Frequent question title.
     * @returns {Promise<unknown>} All frequent questions.
     */
    allFrequentQuestionByDescription(description) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT descrizione, titolo FROM domande_frequenti WHERE titolo LIKE '%' || ? || '%'`;

            this.open();
            db.all(sql, [description], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Add new frequent question.
     * @param {text} topic Question topic.
     * @param {text} description Question description.
     * @param {text} title Question title.
     * @param {int} admin_id Admin id.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    addNewQuestion(topic, description, title, admin_id) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO domande_frequenti(topic, descrizione, titolo, admin_id)
                         VALUES (?, ?, ?, ?)`;

            this.open();
            db.run(sql, [topic, description, title, admin_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all user. If a user is a normal user, return the number of opened tickets, if it ia a staff user return the number of closed tickets.
     * @returns {Promise<unknown>} All user with number of opened/closed tickets.
     */
    allUser() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT u.email,
                                u.tipo,
                                (SELECT COUNT(*)
                                 FROM ticket t
                                          INNER JOIN gestisce g ON t.id = g.id_ticket
                                 WHERE g.id_admin = u.id
                                   AND (t.chiusura_ticket IS NOT NULL AND
                                        (t.stato = 'Closed' OR t.stato = 'Cancelled' OR t.stato = 'Resolved'))) AS closed_tickets,
                                (SELECT COUNT(*)
                                 FROM ticket t2
                                 WHERE t2.id_utente = u.id
                                   AND u.tipo = 'utente')                                                       AS opened_tickets
                         FROM utente u
                         GROUP BY u.email, u.tipo
                         ORDER BY u.tipo ASC, u.email ASC`;

            this.open();
            db.all(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update user type (utente, staff, admin).
     * @param {text} email User email.
     * @param {text} type New user type.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    updateUserRole(email, type) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE utente
                         SET tipo = ?
                         WHERE email = ?`;

            this.open();
            db.run(sql, [type, email], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Search a user by a specific email. Email could be not complete.
     * @param {text} email User email.
     * @returns {Promise<unknown>} User.
     */
    searchUserByUserEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT email, tipo
                         FROM utente
                         WHERE email LIKE '%' || ? || '%'
                         ORDER BY email ASC`;

            this.open();
            db.all(sql, [email], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return all users role.
     * @returns {Promise<unknown>} All users roles.
     */
    getRoles() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT tipo
                         FROM permessi`;

            this.open();
            db.all(sql, [], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Return user role searched by email.
     * @param {text} email User email.
     * @returns {Promise<unknown>} User role.
     */
    getUserRole(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT u.tipo
                         FROM utente u
                         WHERE u.email = ?`;

            this.open();
            db.get(sql, [email], (err, row) => {
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

    /**
     * Assign otp code to a specific user id.
     * @param {int} id User id.
     * @param {int} otp User otp code.
     * @param {int} current_date Otp creation date.
     * @param {int} uuid Link identification code.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    otpCodeAssigment(id, otp, current_date, uuid) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO otp(user_id, otp, date, uuid)
                         VALUES (?, ?, ?, ?)`;

            this.open();
            db.run(sql, [id, otp, current_date, uuid], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Get user id from a specific url id.
     * @param {int} uuid Link identification code.
     * @returns {Promise<unknown>} User data.
     */
    getUserIdByUuid(uuid) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT o.user_id, o.otp, o.date
                         FROM otp o
                         WHERE uuid = ?
                         ORDER BY date DESC
                             LIMIT 1`

            this.open();
            db.get(sql, [uuid], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Update user password with specific user id.
     * @param user_id User id.
     * @param password New user password.
     * @returns {Promise<unknown>} Returns true if successful or false if failed.
     */
    updateUserPasswordById(user_id, password) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE utente
                         SET password = ?
                         WHERE id = ?`;

            this.open();
            db.run(sql, [password, user_id], (err, row) => {
                if (err) throw reject(err);
                resolve(row);
            });
            this.close();
        });
    }

    /**
     * Get user id by user email.
     * @param {text} email User email.
     * @returns {Promise<unknown>} User id.
     */
    getUserId(email) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id
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