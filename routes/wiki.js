var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')


router.get('/', function(req, res, next){
  res.send('retrieve all wiki pages')
})

router.get('/add', function(req, res, next){
  res.send('retrieve add')
})

router.post('/', function(req, res, next){
  res.send('submit new page')
})

module.exports = router;
