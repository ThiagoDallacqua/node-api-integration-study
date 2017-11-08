const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  facebookId: String,
  provider: String
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.statics.findOrCreate = function(args, callback) {
  return this.findOne({
            facebookId: args.id
        }, function(err, user) {
            if (err) {
                return callback(err);
            }
            //No user was found... so create a new user with values from Facebook
            if (!user) {
                user = new User({
                    username: args.displayName || args.username,
                    email: args.emails[0].value,
                    provider: 'facebook',
                    facebookId: args.id
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return callback(err, user);
                });
            } else {
                //found user. Return
                return callback(err, user);
            }
        });
}

const User = mongoose.model('User', UserSchema)

module.exports = () => {
  return User
}
