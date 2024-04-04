const { getRole } = require('./jwt-token');

function isStaff(req, res, next) {
    if (req.user) {
        if (req.user.tipo === 'staff') {
            return true;
        }
    }
    return false;
    // return res.redirect('home', { title: "NGR", user: req.user });
}

// function isAdmin()

module.exports = { isStaff };