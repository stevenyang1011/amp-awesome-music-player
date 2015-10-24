var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');
module.exports = function(app) {
    app.route('/signup')
        .post(users.signup);
    app.route('/signin')
        .post(passport.authenticate('local'), function(req, res) {
            res.send(req.user);
        });
    app.get('/signout', users.signout);
};