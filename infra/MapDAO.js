class MapDAO {
  constructor(model, connect) {
    this._Map = model;
    this._connect = connect;
  }

  create(args, callback){
    this._connect();

    this._Map.create(args, callback)
  }

  list(callback){
    this._connect();

    this._Map.find({}, callback);
  }

  update(args, callback){
    this._connect();

    this._Map.updateOne(
      {"party.id": {$eq: args.partyId}},
      {$set: {location: args.location}},
      callback);
  }

  delete(args, callback){
    this._connect();

    this._Map.deleteOne(
      {"party.id": {$eq: args}},
      callback)
      .then(result => console.log("map marker deleted"))
      .catch(err => console.log(err));
  }
}

module.exports = function() {
    return MapDAO
}
