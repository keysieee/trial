const ensureAuthenticated = (req, res, next) => {
    if (req.session && req.session.employee_id) {
        next();
    } else {
        res.redirect('/login'); // Or any fallback
    }
};

module.exports = ensureAuthenticated;
