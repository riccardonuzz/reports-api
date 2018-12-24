const User = require('../models/user');

exports.signup = (req, res, next) => {
    const {
        email,
        password,
        name,
        lastName,
        birthDate,
        city
    } = req.body;

    // Checking if user provided wrong or empty body
    if(!email || !password || !name || !lastName || !birthDate || !city) {
        return res
            .status(422)
            .send({ error: 'All fields should be provided.' });
    }

    // Checking if the user already exists in db
    User.findOne({ email }).then((existingUser, err) => {
        if (err) {
            return next(err);
        }

        // If a user with email does exists, return an error
        if (existingUser) {
            return res.status(422).send({
                error: 'Email is in use.'
            });
        }

        // If a user with email does NOT exists, create and save user record
        let user = new User({
            email,
            password,
            name,
            lastName,
            birthDate,
            city,
            role: 1
        });

        user.save().then(() => {
            return user.generateAuthToken();
        })
        .then(token => {
            return res.header('Authentication', `Bearer ${token}`).send();

        })
        .catch(e => {
            return res.status(400).send(e);
        });
        
    })
    .catch(e => {
        return next(e);
    });
        
};


exports.signin = (req, res, next) => {
    // TODO: need to check if a User object can be used
    req.user.generateAuthToken()
        .then(token => {
            return res.header('Authentication', `Bearer ${token}`).send({ role: req.user.role });
        })
        .catch(e => {
            res.status(400).send();
        });
};