const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const passport = require('passport');
const BigCommerce = require('./routes/bigcommerce');
const Request = require('./routes/request');

var favicon = require('serve-favicon')
var path = require('path')
const http = require('https');

const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))


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