const mongoose = require('mongoose');

const PartySchema = new mongoose.Schema({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
   },
   party: {
     partyName: String,
     partyDate: Date,
     partyLocation: {
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Map"
       },
       location: Object
     }
   }
});

const Party = mongoose.model('Party', PartySchema)

module.exports = () => {
  return Party
}
