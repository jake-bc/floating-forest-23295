const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const favicon = require('./favicon');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const BigCommerce = require('./routes/bigcommerce');
const Request = require('./routes/request');

var http = require('http')
var favicon = require('serve-favicon')
var finalhandler = require('finalhandler')
var path = require('path')

var _favicon = favicon(path.join(__dirname, 'public', 'favicon.ico'))

var server = http.createServer(function onRequest(req, res) {
    var done = finalhandler(req, res)

    _favicon(req, res, function onNext(err) {
        if (err) return done(err)

        // continue to process the request here, etc.

        res.statusCode = 404
        res.end('oops')
    })
})

const app = express();

//*******************************************************//
//Start Google //

//set up view engine app.set is how we set a 'view engine' 'ejs'= templates
app.set('view engine', 'ejs');

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['keys.session.cookieKey']
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// connect mongodb
mongoose.connect(keys.mongodb.dbURI, () =>{
    console.log('connected to mongodb')
});

//set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/routes/bigcommerce', BigCommerce); 
app.use('/routes/request', Request); 
app.use('/favicon', favicon); 


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