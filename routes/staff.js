const express = require('express');
const router = express.Router();

const DataBase = require("../db"); // db.js
const db = new DataBase();

const { isStaff, isAdmin } = require('../public/js/auth');

router.get('/', function (req, res, next) {
    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to Staff Panel: you are not a staff or admin member or you are not logged in\n");
        return res.redirect('/');
    }

    console.log("Correct routing page: Staff Panel\n");
    return res.render('staff/staff', { title: "Staff panel", user: req.user });
});

router.get('/chartdata', async function (req, res, next) {
    if (!req.user)
        return res.status(401).json();

    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to load data\n");
        return res.redirect('/');
    }
    try {
        const results = await db.numClosedTicketsByStatusByStaffUser(req.user.id);
        const labels = results.map(row => row.stato);
        const data = results.map(row => row.closed_tickets);

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
        
        console.log("Loaded pie chart");
        res.status(200).json(chartData);
    } catch (err) {
        console.error("Error:", err);
    }
});

router.get('/linechartpermonth', async function (req, res, next) {
    if (!req.user)
        return res.status(401).json();

    if (!isStaff(req) && !isAdmin(req)) {
        console.log("Access denied to load data\n");
        return res.redirect('/');
    }
    try {
        const tickets = await db.closedTicketsLastMonthByStaffUser(req.user.id);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthCounts = new Map();
        let maxValue = 0;
        tickets.forEach((ticket) => {
            const monthIndex = ticket.month - 1;
            monthCounts.set(monthIndex, ticket.num_closed_tickets);
            if (ticket.num_closed_tickets > maxValue) {
                maxValue = ticket.num_closed_tickets;
            }
        });

        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Closed tickets',
                    data: months.map((monthLabel, index) => monthCounts.get(index) || 0),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    pointStyle: 'rectRounded',
                    pointRadius: 5,
                    pointHoverRadius: 10
                }
            ]
        };

        const lineChartPerMonth = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Number of closed tickets',
                    }
                },
                scales: {
                    y: {
                        min: 0,
                        max: maxValue + 2,
                    }
                }
            },
        };

        console.log("Loaded line chart\n");
        res.status(200).json(lineChartPerMonth);
    } catch (err) {
        console.error("Error:", err);
    }
});

module.exports = router;