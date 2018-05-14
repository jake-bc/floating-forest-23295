const router = require('express').Router();
const passport = require('passport');
const keys = require('../config/keys');
const User = require('../models/user-models.js');

// Start Google & MongoDB

// auth login
router.get('/login', (req, res) => {
    res.render('login', 
    { 
        user: req.user 
    }
);
});


// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logout();
    res.redirect('/');
});

// auth with google+ 
// when we say 'google' since passport config has the name new 'GoogleStrategy' 
//it knows to use the correct keys
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.login']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send(req.user);
    res.redirect('/profile/');
});

router.post('/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    user.fincOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!user) {
            return res.status(404).send();
        }
        return res.status(200).send();
    })

router.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var newUser = new User({
        first_name: first_name,
        last_name: last_name,
        password: password,
        email: email
    })
})
var newUser = new User;
newUser.save(function (err, savedUser) {
    if (err) {
        console.log(err);
        return res.status(500).send();
    }
    return res.status(200).send();
})
})

module.exports = router;