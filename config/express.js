var config = require('./config'),
    express = require('express'),
    //morgan = require('morgan'),
    //compress = require('compression'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
//methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport')

module.exports = function() {
    var app = express()
// configure app

    app.use(express.static(process.cwd() + '/public'));

    //session
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

// set the view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', process.cwd()+'/app/views');

    app.use(flash())
    app.use(passport.initialize())
    app.use(passport.session())
// log requests to access log
//    var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
//    app.use(morgan('combined', {stream: accessLogStream}));

// log requests to the console
// app.use(morgan('dev'));

// configure body parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    require('../app/routes/index.server.route.js')(app)
    require('../app/routes/api.server.route.js')(app)
    require('../app/routes/user.server.route.js')(app)

    return app
}