var express = require('express');
var app = express();
var morgan = require('morgan')
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var routes = require('./routes/index.js');
var wikiRouter = require('./routes/wiki.js');
var models = require('./models/index.js');

var env = nunjucks.configure("views", {noCache: true});
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(morgan('dev'));

app.use('/wiki', wikiRouter);
app.use('/', routes);

app.use(express.static('public'));

models.User.sync({})
.then(function () {
    return models.Page.sync({})
})
.then(function () {
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error);
