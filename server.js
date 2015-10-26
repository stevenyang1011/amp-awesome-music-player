// call the packages we need
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport')

var db = mongoose()
var app = express()
var passport = passport()

var port     = process.env.PORT || 4570; // set our port

app.get('/', function(req, res) {
	res.render('pages/index');
});

// START THE SERVER
// =============================================================================
app.listen(port);
module.exports = app
console.log('NetEase API server started. Port:  ' + port);
