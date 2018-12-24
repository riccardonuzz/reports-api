const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify this username and password, call done with the user
    // If it is the correct username and password
    // Otherwise, call done with false

    User.findOne({ email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }

        // Compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }

            if(!isMatch) {
                return done(null, false);
            }

            return done(null, user);
        });
    })
});

passport.use(localLogin);
module.exports = passport.authenticate('local', { session: false });

