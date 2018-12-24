const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const config = require('./../config');

const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        // Generate a salt then run callback
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return next(err);
            }

            // Hash (encrypt) our password using the salt
            bcrypt.hash(user.password, salt, null, (err, hash) => {
                if (err) {
                    return next(err);
                }

                // Overwrite plain text password
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


userSchema.methods.generateAuthToken = function() {
    let user = this;
    let token = jwt.sign({ _id: user._id.toHexString(), access: 'auth' }, config.jwtSecret).toString();
    user.tokens = user.tokens.concat([{token}]);
    
    return user.save().then(() => {
        return token;
    });
};


userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};


// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
