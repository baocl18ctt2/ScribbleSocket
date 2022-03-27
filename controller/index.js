const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        req.flash('user', req.session.user)
        next();
    } else {
        res.redirect('/login')
    }
}
module.exports = { checkSession }