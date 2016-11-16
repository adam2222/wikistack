var express = require('express'),
 router = express.Router(),
 bodyParser = require('body-parser'),
 models = require('../models/index.js'),
 Page = models.Page,
 User = models.User;

// **************************

router.get('/', function(req, res, next){
  Page.findAll({})
    .then(function(pageList){
      res.render('index', { pageList: pageList })
    })
    .catch(next);
})

// **************************

router.get('/add', function(req, res, next){
  res.render('addpage')
})

// **************************

router.get('/:urlTitle', function(req, res, next){
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then(function(foundPage){
    if (foundPage === null){
      return next(new Error('Page not found!'));
    }
    // getAuthor is convenience method established by Page.belongsTo(User, {as: 'author'})
    // Explicitly returning all of this in case there is an error to allow it to "bubble down" to .catch()
    return foundPage.getAuthor()
      .then(function(pageAuthor){
        res.render('wikipage', {
          title:  foundPage.title,
          content: foundPage.content,
          author: pageAuthor.name
        })
      })
  })
  .catch(function(err){
    next(err)
  });
})

// ***************************

router.post('/', function(req, res, next){
  /* Receiving 2 sets of inputs from form: user info and page info.  New Page will be created regardless.  User info will either be used to create new user, or assign that user to the newly created page. Either way, User findOrCreate(a sequelize 2-in-one function) must got first, so that its output (new or found user) can be passed along down to new Page and assigned.

*/
  User.findOrCreate({
    where: {
      name: req.body.name,
      email: req.body.email
    }
  })
  // Sequelize's findOrCreate function returns an array containing the record and a boolean saying whether it was created or not.  Bluebird's .spread function is a modified .then in that it 'spread's the array out into separate variables that can be used (in this case we just need newUser).

  .spread(function(newUser, createdBoolean){
      return Page.create({
        title: req.body.title,
        content: req.body.content,
        status: req.body.status
      })
      // The newly created Page is explicitly returned so that it can then be assigned in the next .then
      .then(function(createdPage){
        // set/get{name/alias of relation as set in 'belongsTo' in model} is a convenience method automatically created after specifying relation between 2 tables.  Here, Page belongsTo User {as:'author'}.  This means the Page table has an authorId column, and we set the corresponding author for the newly created page by passing in the newly created/found user to the setAuthor method.
        return createdPage.setAuthor(newUser)
        // We explicity return the createdPage so that page can be redirected to its route below.
      });
  })
  .then(function(createdPage){
    res.redirect(createdPage.route)
  })
  .catch(next);


  // var user = User.build({
  //   author: req.body.author,
  //   email: req.body.email
  // })
  //
  // page.save().then(function(savedPage){
  //   console.log('Saved page!')
  //   res.redirect(savedPage.route);
  // })
  // .catch(next);
})

// **************************

module.exports = router;
