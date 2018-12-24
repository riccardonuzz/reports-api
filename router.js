const Authentication = require('./controllers/Authentication');
const requireSignin = require('./services/LocalStrategy');
const requireAuth = require('./services/JwtStrategy');


module.exports = app => {
    app.post('/signup', Authentication.signup);
    app.post('/signin', requireSignin, Authentication.signin);

    app.get('/ciao', requireAuth, (req, res) => {
        res.send({ hi: 'there' });
    });
};
