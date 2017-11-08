const Authentication = require('../middlewares/Authentication')
const passport = require('passport')
const logger = require('../services/logger.js');


module.exports = app => {
  app.post('/party', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.parties;
    let connect = app.infra.connectionFactory;
    let Parties = new app.infra.PartyDAO(model, connect);

    let party = {
      user: {
        id: req.user._id,
        username: req.user.username
       },
       party: req.body.party
    };

    Parties.create(party, (err, response) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }
      let mapModel = app.models.map;
      let MapLocation = new app.infra.MapDAO(mapModel, connect);

      let map = {
        user: response.user,
        party: {
          id: response._id,
          partyName: response.party.partyName
        },
        location: req.body.location
      }

      MapLocation.create(map, (err, mapLocation) => {
        if (err) {
          console.log(err);
          res.status(500).send(err)

          return
        }

        console.log(mapLocation);

        response.party.partyLocation.id = mapLocation._id;
        response.party.partyLocation.location = mapLocation.location;

        //save the party with the location
        response.save(err => console.log(err));


        res.json(response)
        return
      });
    })
  });

  app.post('/party/search', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.parties;
    let connect = app.infra.connectionFactory;
    let Parties = new app.infra.PartyDAO(model, connect);

    Parties.search(req.body.search, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      res.json(result)
    });
  });

  app.get('/party', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.parties;
    let connect = app.infra.connectionFactory;
    let Parties = new app.infra.PartyDAO(model, connect);

    Parties.list(req.user._id, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      let party = result.map(element => {
        let info = {
          id: element.id,
          party: element.party
        }

        return info
      });

      res.json(party)
    });
  });

  app.put('/party/:id', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.parties;
    let connect = app.infra.connectionFactory;
    let Parties = new app.infra.PartyDAO(model, connect);
    let id = req.params.id;

    let args = {
      userId: req.user._id,
      partyId: id,
      party: req.body.party
    }

    Parties.update(args, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      let mapModel = app.models.map;
      let MapLocation = new app.infra.MapDAO(mapModel, connect);

      let map = {
        partyId: id,
        location: req.body.location
      }

      MapLocation.update(map, (err, mapResult) => {
        if (err) {
          console.log(err);
          res.status(500).send(err)

          return
        }

        let oprResult = {
          partyResult: result,
          mapResult: mapResult
        }

        res.json(oprResult)
        return
      });
    });
  });

  app.delete('/party/:id', Authentication.isLoggedIn, (req, res) => {
    let model = app.models.parties;
    let connect = app.infra.connectionFactory;
    let Parties = new app.infra.PartyDAO(model, connect);
    let id = req.params.id;

    let args = {
      userId: req.user._id,
      partyId: id
    }

    Parties.delete(args, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err)

        return
      }

      let mapModel = app.models.map;
      let MapLocation = new app.infra.MapDAO(mapModel, connect);

      MapLocation.delete(req.params.id, (err, mapResult) => {
        if (err) {
          console.log(err);
          res.status(500).send(err)

          return
        }

        let oprResult = {
          partyResult: result,
          mapResult: mapResult
        }

        res.json(oprResult)
        return
      });
    });
  });
}
