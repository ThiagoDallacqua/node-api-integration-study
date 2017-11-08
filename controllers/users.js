const passport = require('passport')
const logger = require('../services/logger.js');

module.exports = app => {
  app.get('/users/auth/facebook', passport.authenticate('facebook', {scope: ["email"]}));

  app.get('/facebook/return', passport.authenticate('facebook', {failureRedirect: '/facebook/fail', successRedirect: '/facebook/success'}));

  app.get('/facebook/fail', (req, res) => {
    res.status(401).json({ error: true, errorMessage: 'Access to Facebook profile denied or failed' })
  });

  app.get('/facebook/success', (req, res) => {
    let user = {
      username: req.user.username
    }
    res.json(user) 
  });

  app.post('/users/login', (req, res) => { //login route
    req.assert('username', 'A valid username must be informed!')
      .notEmpty();

    req.assert('password', 'A valid password must be informed!')
      .notEmpty();

    let erros = req.validationErrors();

    if (erros) {
      console.log(`validation errors in the login${JSON.stringify(erros)}`);
      logger.error(`validation errors in the login: ${erros}`);

      res.status(400).send(erros);
      return
    }

    let connect = app.infra.connectionFactory;

    connect();

    passport.authenticate('local', { failureFlash: 'Invalid username or password.' })(req, res, () => {
      res.json(req.user.username)
    })
  });

  app.post('/users', (req, res) => { //sign up route
    req.assert('username', 'A valid username must be informed!')
      .notEmpty();

    req.assert('password', 'A valid password must be informed!')
      .notEmpty();

    let erros = req.validationErrors();

    if (erros) {
      console.log(`validation in the resgistration errors ${JSON.stringify(erros)}`);
      logger.error(`validation in the resgistration errors: ${erros}`);

      res.status(400).send(erros);
      return
    }

    let model = app.models.user;
    let connect = app.infra.connectionFactory;
    let user = new app.infra.UserDAO(model, connect);

    let username = req.body.username;
    let pswd = req.body.password;

    user.register({user: username, pswd: pswd}, (err, user) =>{
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      passport.authenticate('local')(req, res, () =>{
        res.json(req.user.username);
      })
    });
  })

  app.delete('/users/logout', (req, res) => { //logout route
    req.logout();

    req.session.destroy()

    res.json({success: true});
  })
}
