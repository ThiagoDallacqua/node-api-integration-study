const passport = require('passport');
const LocalStrategy = require('passport-local');
const FacebookStrategy = require('passport-facebook');

let fbInfo = (process.env.NODE_ENV == 'production')
  ? {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "https://party-finder-api.herokuapp.com/facebook/return",
      profileFields: ['id', 'displayName', 'email']
    }
  : {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3001/facebook/return",
      profileFields: ['id', 'displayName', 'email']
    }

module.exports = app => {
  function generateOrFindUser(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    if (profile.emails[0]) {
      app.models.user.findOrCreate(profile, done)
    }else{
      done();
    }
  }

  passport.serializeUser(app.models.user.serializeUser());
  passport.deserializeUser(app.models.user.deserializeUser());
  passport.use(new LocalStrategy(app.models.user.authenticate()));
  passport.use(new FacebookStrategy(fbInfo, generateOrFindUser));

  return passport
}
