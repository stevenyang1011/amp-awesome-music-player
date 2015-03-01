// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var api   = require('music163');
var fs = require('fs');
// configure app

app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// log requests to access log
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

// log requests to the console
// app.use(morgan('dev'));

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 4570; // set our port

// ROUTES FOR OUR API
// =============================================================================

// create our router
var apiRouter = express.Router();
var router = express.Router();

//render index page
router.get('/', function(req, res) {
	res.render('pages/index');
});

// test route to make sure everything is working (accessed at GET http://localhost:4570/api)
apiRouter.get('/', function(req, res) {
	res.json({ message: 'Welcome to our music 163 api!' });	
});

// on routes that end in /search
// ----------------------------------------------------
apiRouter.route('/search')

	// search for a keyword
	.post(function(req, res) {
		api.search(req.body.q, function(err, data) {
			if (err){
				res.send(err);
			} else {
				res.send(data.result);				
			}
		})
		
	});

// on routes that end in /song
// ----------------------------------------------------
apiRouter.route('/song/:song_id')

	// get the bear with that id
	.get(function(req, res) {
		api.detail(req.params.song_id, function(err, data) {
			if (err){
				res.send(err);
			}
			res.send(data);
		});
	});

// REGISTER OUR ROUTES -------------------------------
app.use('/api', apiRouter);
app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('NetEase API server started. Port:  ' + port);
