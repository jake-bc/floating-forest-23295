const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user-models.js');

// This is the cookie
passport.serializeUser((user, done)=> {
    done(null, user.id)
});

// Take the cookie / id and pass the user
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


//from app.js make sure you const passportSetup = require('./config/passport-setup');
passport.use(
    new GoogleStrategy({
        // The call back URL lives in [Google Cloud Platform] Client ID For Web Application. 
        //Authorized redirect URIs
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists in our db
        console.log(profile)
        User.findOne({googleId: profile.id}).then((currentUser) => {

            if(currentUser){
                // already have a User
                console.log('user is:', currentUser);
                    done(null, currentUser);
                    
            } else {
                // if not, create a User in our db
                new User({
                    googleId: profile.id,
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    image: profile._json.image.url,
                    gender: profile.gender,
                    email: profile.emails[0].value,
                    username: profile.emails[0].value,


                }).save().then((newUser) => {
                    console.log('new user created' + newUser);
                    done(null, newUser);
            });
        }
        });
    }))

    
