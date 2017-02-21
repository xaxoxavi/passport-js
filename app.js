var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var userDao = require('../mongo-dao');

app.use(passport.initialize());

function findOne(userName, password, done) {

    userDao.findOne({ username: userName }, function (err, user) {

        console.log(user);
        if (err) return done(null, false, { message: 'Fallo no controlado.' });

        if (!user) return done(null, false, { message: 'Usuario incorrecto.' });

        if (password === user.password) {
            return done(null, { username: userName, password: password });
        } else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    });


}

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log('local: ' + username);
        return findOne(username, password, done);
    }
));

passport.use(new BasicStrategy(
    function (username, password, done) {
        console.log('basic: ' + username);
        return findOne(username, password, done);
    }
));

app.get("/", passport.authenticate('local', { session: false }), function (req, res) {

    res.send("ok");
});

app.post("/", passport.authenticate('basic', { session: false }), passport.authenticate('local', { session: false }), function (req, res) {

    res.send("ok");
});

app.listen(3000, function () {
    console.log("Arrancaa 3000");
});

