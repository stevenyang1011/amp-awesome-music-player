var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');
module.exports = function(app) {
    app.route('/user/signup')
        .post(users.signup);
    app.route('/user/login')
        .post(passport.authenticate('local'), function(req, res) {
            res.send({code: '200', user: req.user});
        });
    app.get('/user/logout', users.signout);
    app.put('/user/playlist/:userId', users.update);
};