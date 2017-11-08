const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function createDBConnection() {
  if (!process.env.NODE_ENV) {
    mongoose.connect("mongodb://localhost/party_finder_api", {useMongoClient: true})
  }

  if (process.env.NODE_ENV == 'production') {
    mongoose.connect(process.env.MONGOLAB_TEAL_URI, {useMongoClient: true})
  }

  return mongoose
}

module.exports = () => {
  return createDBConnection;
}
