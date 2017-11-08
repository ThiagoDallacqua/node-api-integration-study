const mongoose = require('mongoose');

const MapSchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
   },
   party: {
     id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Party"
     },
     partyName: String
   },
   location: Object
});

const Map = mongoose.model('Map', MapSchema)

module.exports = () => {
  return Map
}
