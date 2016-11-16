var express = require('express'),
 app = express(),
 morgan = require('morgan'),
 bodyParser = require('body-parser'),
 nunjucks = require('nunjucks'),
 routes = require('./routes/index.js'),
 wikiRouter = require('./routes/wiki.js'),
 usersRouter = require('./routes/users.js'),
 models = require('./models/index.js');


app.set('view engine', 'html');
app.engine('html',  nunjucks.render);
nunjucks.configure("views", { noCache: true });

app.use(bodyParser.urlencoded( { extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));
app.use(express.static('public'));

// ******************

app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);
app.use('/', routes);


// ******************

app.use('/', function(err, req, res, next){
	console.error(err);
	res.status(500).send(err.message);
})

models.Page.sync({ force: false })
	.then(models.User.sync({ force: false }))
	.then(function() {
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
	})
.catch(function(err){
  console.error(err);
  res.status(500).send(err.message);
});
