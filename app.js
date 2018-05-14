'use strict';

const express = require('express'),
    authRoutes = require('./routes/auth-routes'),
    profileRoutes = require('./routes/profile-routes'),
    passportSetup = require('./config/passport-setup'),
    mongoose = require('mongoose'),
    keys = require('./config/keys'),
    bodyParser = require('body-parser'),
    cookieSession = require('cookie-session'),
    passport = require('passport'),
    favicon = require('serve-favicon'),
    finalhandler = require('finalhandler'),
    path = require('path'),
    
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//*******************************************************//
//Start Google //

//set up view engine app.set is how we set a 'view engine' 'ejs'= templates
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['keys.session.cookieKey']
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon)
// connect mongodb
mongoose.connect(keys.mongodb.dbURI, () =>{
    console.log('connected to mongodb')
});

//set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);


// create home route / '=> es6 arrow function' with two params (request, response)
app.get('/', (req, res) => {
   //render the template
    res.render('home', { user: req.user });
});

//*******************************************************//

//Start BigCommerce //


// listen for app on port 3000 / callback function
app.listen(3000, () => {
    console.log('app now listenting for requests on port 3000');

});