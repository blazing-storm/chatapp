const User = require('../models/user');

// render the sign up page
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_up', {
        title: "Sign Up"
    });
}

// render the sign in page
module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }

    return res.render('user_sign_in', {
        title: "Sign In"
    });
}

// get the sign up data
module.exports.create = function(req, res) {
    if(req.body.password != req.body.confirm_password)
        return res.redirect('back');

    User.findOne({email: req.body.email}, function(err, user) {
        if(err) { console.log('Error in finding user during sign up'); return; }

        if(!user) {
            User.create(req.body, function(err, user) {
                if(err) { console.log('Error in creating user during sign up'); return; }

                // console.log(User.avatarPath);

                // adding the default avatar
                user.avatar = User.avatarPath + '/default-avatar.png';
                user.save();

                console.log(user);
                return res.redirect('/users/sign-in');
            })
        }
        else {
            console.log('User already exists!');
            req.flash('error', 'User already exists!');
            return res.redirect('back');
        }
    });
}

// sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in Successfully!');
    return res.redirect('/');
}

// destroy the session and sign out the user
module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out!');
    
    return res.redirect('/users/sign-in');
}