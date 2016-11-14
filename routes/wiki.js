var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var models = require('../models/index.js')
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res, next){
  res.redirect('/')
})

router.get('/add', function(req, res, next){
  res.render('addpage')
})

router.post('/', function(req, res, next){

  var page = Page.build({
    title: req.body.title,
    content: req.body.content
  });

  page.save();
  res.json(page);
})

module.exports = router;
