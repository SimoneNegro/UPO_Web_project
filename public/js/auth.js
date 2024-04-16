function isStaff(req, res, next) {
    if (req.user) {
        if (req.user.tipo === 'staff') {
            return true;
        }
    }
    return false;
    // return res.redirect('home', { title: "NGR", user: req.user });
}

function isAdmin(req, res, next) {
    if (req.user) {
        if (req.user.tipo === 'admin') {
            return true;
        }
    }
    return false;
}

module.exports = {isStaff, isAdmin};