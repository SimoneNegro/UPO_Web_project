# Web project

This is an educational project.

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
- admin: are users that

Il sito web è stato realizzato con Node js e i suoi pacchetti.

Ho deciso di usare file `.ejs` e non `.html` perché permette la gestione dinamica delle pagine web.

Per la realizzazione del DB mi sono appoggiato a DBeaver e ho usato SQLite.

Nelle cartelle sono presenti:

- `databases`: database utili al back-end del programma.
- `models`: definisce il DAO, ossia fornisce un'interfaccia unificata per l'accesso ai dati;
- public:
  - `js`: definisce funzioni utili al front-end;
  - `style`: definisce lo stile del front-end;
- `routes`: definisce i percorsi e i metodi HTTP, andando a gestire il back-end;
- `views`: definisce le pagine vere e proprie del sito web.

## Dettagli

Per andare a vedere quello che riguarda il front-end, basta andare a vedere le pagine presenti nelle `views`, dove lo stile viene definito nella cartella `style` e tutto ciò che riguarda alcune validazioni o migliori grafiche avanzate, basta guardare la cartella `js`.

La parte più complessa da capire è il back-end. Il file main e più importante è `server.js`.
