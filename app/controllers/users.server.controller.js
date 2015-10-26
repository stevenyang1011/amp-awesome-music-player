var User = require('mongoose').model('User'),
    passport = require('passport');

var getErrorMessage = function (err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
                message;
        }
    }
    return message;
};

//exports.renderSignin = function (req, res, next) {
//    if (!req.user) {
//        res.render('signin', {
//            title: 'Sign-in Form',
//            messages: req.flash('error') || req.flash('info')
//        });
//    } else {
//        return res.redirect('/');
//    }
//};
//
//exports.renderSignup = function (req, res, next) {
//    if (!req.user) {
//        res.render('pages/signup', {
//            title: 'Sign-up Form',
//            messages: req.flash('error')
//        });
//    } else {
//        return res.redirect('/');
//    }
//};

exports.signup = function (req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        user.provider = 'local';
        user.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);
                //req.flash('error', message);
                res.status(400).send({'code': 400, 'message': message});
            }
            req.login(user, function (err) {
                res.send({'code': 200, 'user': user});
            });
        });
    } else {
        res.status(400).send({'code':'400'});
    }
};


//exports.signin = function (req, res) {
//    console.log(req);
//    console.log(res);
//    passport.authenticate('local', function(err, user, info) {
//        if (!user) {
//            res.send({'code': 403, 'message': 'no user'});
//        }
//        req.logIn(user, function(err) {
//            if (err) {
//                res.send({'code': 403, 'message': 'error when logging in'});
//            }
//            res.send({'detail': info});
//        });
//    });
//};

exports.signout = function (req, res) {
    req.logout();
    res.send({'code': 200});
};

exports.create = function (req, res, next) {
    var user = new User(req.body)
    user.save(function (err) {
        if (err) {
            return next(err)
        } else {
            res.json(user)
        }
    })
};

exports.update = function (req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function (err, user) {
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function (req, res, next) {
    req.user.remove(function (err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    });
};