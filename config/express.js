const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const morgan = require('morgan');
const logger = require('../services/logger.js');


const sess = (process.env.NODE_ENV == 'production')
  ? {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { name: 'user_session' },
    store: new MongoStore({ mongooseConnection: function() { //creates a session store with MongoDB to prevent memory leak in the server
      mongoose.connect(process.env.MONGOLAB_TEAL_URI, {useMongoClient: true});

      const db = mongoose.connection;

      return db
    }()})
  }
  : {
    secret: "you shall not pass",
    resave: true,
    saveUninitialized: false,
    cookie: { name: 'user_session' },
    store: new MongoStore({ mongooseConnection: function() { //creates a session store with MongoDB to prevent memory leak in the server
      mongoose.connect("mongodb://localhost/party_finder_api", {useMongoClient: true});

      const db = mongoose.connection;

      return db
    }()})
  };

module.exports = function() {
  const app = express();

  app.use(morgan("common", {
    stream: {
      write: function(message) {
        logger.info(message)
      }
    }
  }));
  app.use(bodyParser.json());
  app.use(expressValidator());

  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function(req, res, next) { //CORS config
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  consign()
  .include('controllers')
  .then('infra')
  .then('models')
  .then('utils')
  .then('middlewares')
  .into(app);

  return app
}
