const Authentication = require('../middlewares/Authentication')
const logger = require('../services/logger.js');


module.exports = app => {
  app.post('/comments', Authentication.isLoggedIn, (req, res) => {
    req.assert('comment', 'Comment must not be empty!')
      .notEmpty();

    let erros = req.validationErrors();

    if (erros) {
      console.log(`validation errors in the login${JSON.stringify(erros)}`);
      logger.error(`validation errors in the login: ${erros}`);

      res.status(400).send(erros);
      return
    }

    let model = app.models.comments;
    let connect = app.infra.connectionFactory;
    let Comments = new app.infra.CommentDAO(model, connect);

    let comment = {
      user: {
        id: req.user._id,
        username: req.user.username
       },
       comment: req.body.comment
    };

    Comments.create(comment, (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }
      //save the comment
      response.save();

      res.json(response)
      return
    })
  });

  app.get('/comments', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.comments;
    let connect = app.infra.connectionFactory;
    let Comments = new app.infra.CommentDAO(model, connect);

    Comments.list(req.user._id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      let comment = result.map(element => {
        let info  = {
          id: element.id,
          comment: element.comment
        }

        return info
      });

      res.json(comment)
    });
  });

  app.put('/comments/:id', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.comments;
    let connect = app.infra.connectionFactory;
    let Comments = new app.infra.CommentDAO(model, connect);
    let id = req.params.id;

    let args = {
      userId: req.user._id,
      commentId: id,
      comment: req.body.comment
    }

    Comments.update(args, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      res.json(result)
    });
  });

  app.delete('/comments/:id', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.comments;
    let connect = app.infra.connectionFactory;
    let Comments = new app.infra.CommentDAO(model, connect);
    let id = req.params.id;

    let args = {
      userId: req.user._id,
      commentId: id
    }

    Comments.delete(args, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      res.json(result)
    });
  });
}
