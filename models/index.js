
var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', { logging: false }
);


function generateUrlTitle(title){
  if (title) {
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    return Math.random().toString(36).substring(2, 7);
  }
}

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
        isURL: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
}, {
    hooks:  {
      beforeValidate: function(page){
        console.log(page)
        page.urlTitle = generateUrlTitle(page.title)
        }
    },
    getterMethods: {
      route: function(page){
        return "/wiki/" + this.urlTitle;
      }
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false

    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true

    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};
