const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('../config');

// Setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {

    // See if the user ID in the payload exists in our database
    // If it does, call "done" with that user
    // otherwise,+ call done without a user object
    User.findById(payload._id, (err, user) => {
        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});


// Tell passport to use this strategy
passport.use(jwtLogin);
module.exports = passport.authenticate('jwt', { session: false });
