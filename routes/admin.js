const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const {isStaff} = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (!isStaff(req)) {
        return res.redirect('/');
    }

    return res.render('admin/admin', {title: "Staff panel", user: req.user});
});

router.get('/chartdata', async function (req, res, next) {
    if(!req.user) {return res.status(401).json();}
    try {
        const results = await db.numClosedTicketsByStatusByStaffUser(req.user.id);
        // console.log(results);
        const labels = results.map(row => row.stato);
        // console.log(labels);
        const data = results.map(row => row.closed_tickets);
        // console.log(data);

        const chartData = {
            type: 'pie', // Or choose another chart type (bar, line, etc.)
            data: {
                labels,
                datasets: [{
                    label: 'Ticket Status Distribution',
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)', // Customize colors as desired
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(54,235,117,0.2)',
                        'rgba(67, 67, 67, 0.2)', // Add more colors for more statuses
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgb(54,235,72)',
                        'rgba(67, 67, 67, 1)',
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'All Closed Tickets'
                    }
                },
            },
        };
        // console.log(chartData);
        res.status(200).json(chartData);
    } catch (err) {
        console.error("Error:", err);
        // TODO: handle error
    }
});

module.exports = router;