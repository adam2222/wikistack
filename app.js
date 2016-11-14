var express = require('express');
var app = express();
var morgan = require('morgan')
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var routes = require('./routes/index.js');

var env = nunjucks.configure("views", {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(routes)
app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(3000, function(req, res) {
	console.log("We're Listening...");
});