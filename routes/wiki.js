var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')


router.get('/', function(req, res, next){
  res.redirect('/')
})

router.get('/add', function(req, res, next){
  res.render('addpage')
})

router.post('/', function(req, res, next){
  res.send(req.body)

  // res.json(req.body);
  // res.send('submit new page')
})

module.exports = router;
