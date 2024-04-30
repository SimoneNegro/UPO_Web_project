# Web project

This is an educational project made from zero to this.

## Description

This web application is a helpdesk. The essential part of this application is to create and manage tickets opened by users.

There are three different users:

- utente: normal users that can navigate through main pages. They can open tickets inside of 'Open ticket' page. They can visualize tickets status (if the tickets are pending or waiting to transfer) and they can also see all their closed tickets.
- staff: are users that handle all tickets user. They can visualize opened tickets and handle them. They can change tickets status:
  - waiting to transfer: transfer a ticket to another staff member;
  - solved: problem solved successfully;
  - closed: can't solve ticket problem yet;
  - cancelled: not a real issue.
  
  They can also see all closed tickets by themselves and see two different charts to see them progress.
- admin: are users that can navigate through all pages (user and staff pages). They can change users status between user, staff and admin. In addition they can add and remove frequent questions that are shown on frequent questions page.

Website backend is built using [Node js](https://nodejs.org/en) and written in [JavaScript](https://www.javascript.com). To create database i used [DBeaver](https://dbeaver.io) with [SQLite](https://www.sqlite.org) DBMS.

Website frontend is written using [EJS](https://ejs.co).

I used this combination because it was required by the teachers.

## How to install and run the project

To install and run the project is very simple.

Go to code to install or clone the project.

Once you have done you have to configure the `.env` file (you can create this file directly inside main project folder). You have to configure:

- TOKEN_KEY: you have to generate the token with a random string. After you have generated the string, you must have to crypt it (i used SHA256 encryption algorithm). This token is an environment variable used as a secret key for signing [JWT](https://jwt.io) tokens;
- MAIL_USERNAME: put an email address that is used for sending OTP code to reset user password;
- MAIL_PASSWORD: to create this token, you must follow [this guide](https://support.google.com/mail/answer/185833?hl=en) using MAIL_USERNAME mail.

After that, run `server.js` and that's it. You can run this file with terminal to by digit `node server`.

## How to move inside the project

The main folder contains:

``` bash
.
├── `databases`                   # Contain a database test.
├── `public`
│   ├── `js`                      # Define front-end function.
│   └── `style`                   # Define front-end style.
├── `routes`                      # Define file routes and HTTP method to handle the backend.
├── `views`                       # Define website pages.
├── `.env`                        # Contain secret environment variable
└── `server.js`                   # Call all `routes` pages and setup project structure.
```

## Contribute to the project

If you want to contribute to the project, you are free to contribute by pushing requests. You can already see some open issues that you can work on.
