class PartyDAO {
  constructor(model, connect) {
    this._Party = model;
    this._connect = connect;
  }

  create(args, callback){
    this._connect();

    this._Party.create(args, callback)
  }

  list(args, callback){
    this._connect();

    this._Party.find({"user.id": {$eq: args}}, callback);
  }

  search(args, callback){
    this._connect();

    this._Party.find({$where: `this.party.partyName.match(/${args}/i)`}, callback);
  }

  update(args, callback){
    this._connect();

    this._Party.updateOne(
      {"user.id": {$eq: args.userId}, _id: args.partyId},
      {$set: {party: args.party}},
      callback);
  }

  delete(args, callback){
    this._connect();

    this._Party.deleteOne(
      {"user.id": {$eq: args.userId}, _id: args.partyId},
      callback)
      .then(result => console.log("party deleted"))
      .catch(err => console.log(err));
  }
}

module.exports = function() {
    return PartyDAO
}
