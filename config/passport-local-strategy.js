const User = require('../models/user');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

passport.setAuthenticatedUser = function(req, res, next) {
    if(req.isAuthenticated())
        res.locals.user = req.user;

    next();
}

passport.checkAuthentication = function(req, res, next) {
    if(req.isAuthenticated())
        return next();

    return res.redirect('/users/sign-in');
}

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if(err) {return done(err);}
        return done(null, user);
    })
})

passport.serializeUser(function(user, done) {
    done(null, user.id);
})

passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if(err) {return done(err);}

            if(!user || user.password != password) {
                return done(null, false);
            }

            return done(null, user);
        })
    }
))

module.exports = passport;