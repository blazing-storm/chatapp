const User = require('../models/user');

module.exports.destroySession = function(req, res) {
    req.logout();
    return res.redirect('/');
}

module.exports.createSession = function(req, res) {
    return res.redirect('/');
}

module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) { console.log(err); return; }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) { console.log(err); return; }

                console.log(user);
                return res.redirect('/users/sign-in');
            })
        }
        else {
            console.log('User already exists!');
            return res.redirect('back');
        }
    });
}

module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_in', {
        title: "Sign In"
    });
}

module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_up', {
        title: "Sign Up"
    });
}

